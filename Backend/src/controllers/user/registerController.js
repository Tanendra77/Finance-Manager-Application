const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const { generateOtpCode, otpExpiry } = require('../../utils/otp');
const { sendOTPEmail } = require('../../services/emailService');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists', message: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 12);
    const otp = generateOtpCode();
    const expiry = otpExpiry(10);
    await pool.query(
      `INSERT INTO users (name, email, password_hash, is_verified, otp_code, otp_expires)
      VALUES ($1, $2, $3, false, $4, $5)`,
      [name, email, hash, otp, expiry]
    );
    await sendOTPEmail(email, otp);
    res.status(201).json({ message: 'Registration started. Check your email for the OTP.' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed' });
  }
};
