const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('../config/db');
const jwt = require('jsonwebtoken');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const googleId = profile.id;
      const email = profile.emails[0].value;
      const name = profile.displayName;

      // 1. Check if user exists by oauth_provider and oauth_id
      const result = await pool.query(
        'SELECT * FROM users WHERE oauth_provider = $1 AND oauth_id = $2',
        ['google', googleId]
      );

      let user;

      if (result.rows.length > 0) {
        user = result.rows[0];
      } else {
        // 2. If not, check if user with the same email exists (maybe registered by email/password)
        const emailResult = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [email]
        );
        if (emailResult.rows.length > 0) {
          // Optionally: link Google account to this user
          user = (await pool.query(
            'UPDATE users SET oauth_provider=$1, oauth_id=$2, is_verified=TRUE WHERE email=$3 RETURNING *',
            ['google', googleId, email]
          )).rows[0];
        } else {
          // 3. Create new user
          user = (await pool.query(
            `INSERT INTO users
              (name, email, is_verified, oauth_provider, oauth_id)
             VALUES ($1, $2, TRUE, $3, $4)
             RETURNING *`,
            [name, email, 'google', googleId]
          )).rows[0];
        }
      }

      // 4. Pass user object to Passport
      return done(null, user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      return done(err, null);
    }
  }
));

// Serialize/deserialize for future session support (optional with JWT, useful for req.user)
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
