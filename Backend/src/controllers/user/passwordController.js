const pool = require('../../config/db');
const bcrypt = require('bcrypt');

exports.updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    const userRes = await pool.query('SELECT password_hash FROM users WHERE id = $1', [userId]);
    if (!userRes.rows.length) return res.status(404).json({ error: 'User not found' });

    const valid = await bcrypt.compare(currentPassword, userRes.rows[0].password_hash);
    if (!valid) return res.status(400).json({ error: 'Incorrect current password' });

    const hash = await bcrypt.hash(newPassword, 12);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, userId]);

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Update password error:', err);
    res.status(500).json({ error: 'Password update failed' });
  }
};
