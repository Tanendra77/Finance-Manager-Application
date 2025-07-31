const pool = require('../../config/db');

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [userId]);
    if (!result.rows.length) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
