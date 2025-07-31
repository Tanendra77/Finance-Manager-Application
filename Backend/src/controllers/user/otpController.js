const pool = require('../../config/db');
const { generateOtpCode, otpExpiry } = require('../../utils/otp');
const { sendOTPEmail } = require('../../services/emailService');
const bcrypt = require('bcrypt');

exports.verifyOtp = async (req, res) => {// Verify OTP for registration
  try {
    const { email, otp } = req.body;
    const userRes = await pool.query('SELECT otp_code, otp_expires, is_verified FROM users WHERE email = $1', [email]);
    if (!userRes.rows.length) return res.status(404).json({ error: 'User not found' });
    const user = userRes.rows[0];

    if (user.is_verified)
      return res.status(400).json({ message: 'User already verified' });

    if (!user.otp_code || user.otp_code !== otp)
      return res.status(400).json({ error: 'Invalid OTP code' });

    if (new Date() > new Date(user.otp_expires))
      return res.status(400).json({ error: 'OTP expired' });

    await pool.query('UPDATE users SET is_verified = true, otp_code = NULL, otp_expires = NULL WHERE email = $1', [email]);
    res.json({ message: 'Account verified successfully.' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};


exports.resendOtp = async (req, res) => {//resend OTP 
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const userRes = await pool.query('SELECT is_verified FROM users WHERE email = $1', [email]);

    if (!userRes.rows.length) {
      // Respond with generic message to avoid email enumeration
      return res.status(200).json({ message: 'If the email exists, a new OTP has been sent.' });
    }

    if (userRes.rows[0].is_verified) {
      return res.status(400).json({ error: 'User already verified. Please log in.' });
    }

    const otp = generateOtpCode();
    const expiry = otpExpiry(10);

    await pool.query(
      'UPDATE users SET otp_code = $1, otp_expires = $2 WHERE email = $3',
      [otp, expiry, email]
    );

    await sendOTPEmail(email, otp);

    res.json({ message: 'A new OTP has been sent to your email.' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ error: 'Unable to resend OTP at this time. Please try again later.' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userRes = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (!userRes.rows.length)
      return res.status(200).json({ message: 'If user exists, OTP sent to email.' });
    
    const otp = generateOtpCode();
    const expiry = otpExpiry(10);
    await pool.query('UPDATE users SET otp_code = $1, otp_expires = $2 WHERE email = $3', [otp, expiry, email]);
    await sendOTPEmail(email, otp);
    res.json({ message: 'If user exists, OTP sent to email.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to initiate password reset' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const userRes = await pool.query('SELECT otp_code, otp_expires FROM users WHERE email = $1', [email]);
    if (!userRes.rows.length) return res.status(404).json({ error: 'User not found' });
    const user = userRes.rows[0];

    if (!user.otp_code || user.otp_code !== otp)
      return res.status(400).json({ error: 'Invalid OTP code' });

    if (new Date() > new Date(user.otp_expires))
      return res.status(400).json({ error: 'OTP expired' });

    const hashed = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = $1, otp_code = NULL, otp_expires = NULL WHERE email = $2', [hashed, email]);
    res.json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Password reset failed' });
  }
};
