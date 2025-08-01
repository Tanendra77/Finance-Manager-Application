const express = require('express');
const passport = require('../services/passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

// 1. Initiate Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// 2. Handle Google OAuth callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    // Issue JWT after successful Google login!
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    // You can redirect to frontend with token or send JSON directly:
    res.json({ token, user });
    // Or redirect: res.redirect(`${FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

module.exports = router;
