const pool = require('../../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query('SELECT id, name, email, password_hash, is_verified FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }
    const user = result.rows[0];

    if (!user.is_verified) {
      return res.status(401).json({ error: 'Account not verified', message: 'Verify your email before logging in' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials', message: 'Email or password is incorrect' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
};
