const bcrypt = require('bcryptjs');
const { pool } = require('../config/db');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');

// @desc    Register new user
// @route   POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user exists
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const userRole = ['donor', 'receiver'].includes(role) ? role : 'receiver';

    await pool.query(
      'INSERT INTO users (name, email, password, role, is_verified) VALUES (?, ?, ?, ?, TRUE)',
      [name, email, hashedPassword, userRole]
    );

    const [newUser] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    const newId = newUser[0].id;

    // Create donor/receiver profile entry
    if (userRole === 'donor') {
      await pool.query('INSERT IGNORE INTO donors (user_id) VALUES (?)', [newId]);
    } else if (userRole === 'receiver') {
      await pool.query('INSERT IGNORE INTO receivers (user_id) VALUES (?)', [newId]);
    }

    res.status(201).json({
      success: true,
      message: 'Registration successful. You can now log in.',
      email,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }
    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful.',
      user: payload,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
const refresh = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ success: false, message: 'No refresh token.' });
  try {
    const decoded = verifyRefreshToken(token);
    const payload = { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role };
    const accessToken = generateAccessToken(payload);
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.json({ success: true, user: payload });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
};

// @desc    Logout
// @route   POST /api/auth/logout
const logout = (req, res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out successfully.' });
};

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, is_verified, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    res.json({ success: true, user: users[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../config/mailer');

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    const user = users[0];

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await pool.query('UPDATE users SET reset_token = ?, reset_token_expires_at = ? WHERE email = ?', [
      resetTokenHash,
      resetExpiresAt,
      email,
    ]);

    const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(email, user.name, resetLink);

    res.json({ success: true, message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const [users] = await pool.query(
      'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires_at > NOW()',
      [resetTokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await pool.query(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?',
      [hashedPassword, users[0].id]
    );

    res.json({ success: true, message: 'Password properly reset. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { register, login, refresh, logout, getMe, forgotPassword, resetPassword };
