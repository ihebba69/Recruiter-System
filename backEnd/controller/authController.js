// controllers/authController.js
const User = require('../model/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
const crypto = require('crypto');

// Email transport configuration
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || "24f729977124b1",
    pass: process.env.SMTP_PASS || "319d7b6ccb061c"
  }
});

// Token generation utilities
const generateAccessToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_ACCESS_SECRET || "accessKey",
    { expiresIn: "30m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET || "refreshKey",
    { expiresIn: "7d" }
  );
};

// Store refresh tokens (consider using Redis in production)
let refreshTokens = new Set();

const authController = {
  register: async (req, res) => {
    try {
      const { fullname, email, password, phone, address } = req.body;

      // Validate input
      if (!fullname || !email || !password) {
        return res.status(400).json({ error: 'Fullname, email, and password are required' });
      }

      // Check for existing user
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Generate verification code
      const verificationCode = crypto.randomBytes(32).toString('hex');

      // Create user
      const user = new User({
        fullname,
        email,
        password,
        phone,
        address,
        code: verificationCode,
      });
      await user.save();

      // Send verification email
      await transport.sendMail({
        from: process.env.EMAIL_FROM || 'application@recruitment.com',
        to: email,
        subject: `Welcome ${fullname} - Verify Your Account`,
        html: `
          <h1>Welcome to Our Platform</h1>
          <p>Please click the link below to verify your account:</p>
                     <a href="http://localhost:5000/auth/verify/${verificationCode}">

            Verify Account
          </a>
        `,
      });

      // Generate tokens
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.add(refreshToken);

      // Response
      res.status(201).json({
        message: 'Registration successful. Please check your email for verification.',
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  verify: async (req, res) => {
    try {
      const { code } = req.params;

      const user = await User.findOne({ code });
      if (!user) {
        return res.sendFile(path.join(__dirname, '../template/error.html'));
      }

      user.verify = true;
      user.code = undefined;
      await user.save();

      res.sendFile(path.join(__dirname, '../template/success.html'));
    } catch (error) {
      res.sendFile(path.join(__dirname, '../template/error.html'));
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      if (!user.verify) {
        return res.status(403).json({ error: 'Please verify your email first' });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      refreshTokens.add(refreshToken);

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          fullname: user.fullname,
          email: user.email,
        },
        accessToken,
        refreshToken
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken || !refreshTokens.has(refreshToken)) {
        return res.status(403).json({ error: 'Invalid refresh token' });
      }

      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || "refreshKey",
        async (err, decoded) => {
          if (err) {
            refreshTokens.delete(refreshToken);
            return res.status(403).json({ error: 'Invalid refresh token' });
          }

          const user = await User.findById(decoded.userId);
          if (!user) {
            return res.status(404).json({ error: 'User not found' });
          }

          const newAccessToken = generateAccessToken(user);
          const newRefreshToken = generateRefreshToken(user);

          refreshTokens.delete(refreshToken);
          refreshTokens.add(newRefreshToken);

          res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken
          });
        }
      );
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = Date.now() + 3600000; // 1 hour

      user.token = resetToken;
      user.resetPasswordExpiry = resetTokenExpiry;
      await user.save();

      await transport.sendMail({
        from: process.env.EMAIL_FROM || "application@recruitment.com",
        to: email,
        subject: 'Password Reset Request',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Reset Your Password</title>
          </head>
          <body>
            <h1>Password Reset Request</h1>
            <p>Please click the link below to reset your password:</p>
              <a href="http://localhost:5000/auth/resetPassword/${resetToken}">
              Reset Password
            </a>
            <p>This link will expire in 1 hour.</p>
          </body>
          </html>
        `
      });

      res.json({ message: 'Password reset email sent' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      const user = await User.findOne({
        token,
        resetPasswordExpiry: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }

      user.password = password;
      user.token = undefined;
      user.resetPasswordExpiry = undefined;
      await user.save();

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      refreshTokens.delete(refreshToken);
      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password -token -resetPasswordExpiry');
      res.json({
        message: 'success',
        data: users
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = authController;
