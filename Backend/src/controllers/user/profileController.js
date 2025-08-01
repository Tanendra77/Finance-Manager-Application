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

exports.updateProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const profilePicBuffer = req.file.buffer; // BLOB data

    await pool.query(
      'UPDATE users SET profile_pic = $1, updated_at = NOW() WHERE id = $2',
      [profilePicBuffer, userId]
    );

    res.json({ message: 'Profile photo updated successfully' });
  } catch (err) {
    console.error('Profile photo update error:', err);
    res.status(500).json({ error: 'Failed to update profile photo' });
  }
};

exports.getProfilePic = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'SELECT profile_pic FROM users WHERE id = $1',
      [userId]
    );

    if (!result.rows.length || !result.rows[0].profile_pic) {
      return res.status(404).json({ error: 'Profile photo not found' });
    }

    const imgBuffer = result.rows[0].profile_pic;

    // Set appropriate content type header, e.g., assuming JPEG; you can improve by storing MIME type
    res.set('Content-Type', 'image/jpeg');
    res.send(imgBuffer);
  } catch (err) {
    console.error('Get profile photo error:', err);
    res.status(500).json({ error: 'Failed to get profile photo' });
  }
};