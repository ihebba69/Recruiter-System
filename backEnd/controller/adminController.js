const Admin = require('../model/adminModel');
const User = require('../model/userModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Email transport configuration
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "sandbox.smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const adminController = {
  createAdmin: async (req, res) => {
    try {
      const { userId, email, analyseOffre, gestionOffre, gererUtilisateur } = req.body;
      
      // Generate verification code
      const verificationCode = crypto.randomBytes(6).toString('hex');

      // Find and update user to admin role
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      user.role = 'admin';
      await user.save();

      // Create new admin
      const admin = new Admin({
        user: userId,
        verificationCode,
        analyseOffre,
        gestionOffre,
        gererUtilisateur,
        isVerified: false
      });

      await admin.save();

      // Send verification email
      await transport.sendMail({
        from: process.env.EMAIL_FROM || "application@recruitment.com",
        to: email,
        subject: `Welcome Admin - ${user.username}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="UTF-8">
            <title>Admin Verification</title>
          </head>
          <body>
            <h1>Verify Your Admin Account</h1>
            <p>Please click the link below to verify your admin account:</p>
            <a href="${process.env.FRONTEND_URL}/admin/verify/${verificationCode}">
              Verify Account
            </a>
          </body>
          </html>
        `
      });

      res.status(201).json({
        message: "Admin created successfully. Please check email for verification.",
        data: admin
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  verifyAdmin: async (req, res) => {
    try {
      const { code } = req.params;
      
      const admin = await Admin.findOne({ verificationCode: code });
      if (!admin) {
        return res.status(404).json({ error: 'Invalid verification code' });
      }

      admin.isVerified = true;
      admin.verificationCode = undefined;
      await admin.save();

      res.json({ message: 'Admin verified successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  getAdmins: async (req, res) => {
    try {
      const admins = await Admin.find()
        .populate('user', 'username email')
        .select('-verificationCode');
      
      res.json({
        message: "success",
        data: admins
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAdminById: async (req, res) => {
    try {
      const admin = await Admin.findById(req.params.id)
        .populate('user', 'username email')
        .select('-verificationCode');

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      res.json({
        message: "success",
        data: admin
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  updateAdmin: async (req, res) => {
    try {
      const updates = req.body;
      delete updates.verificationCode; // Prevent verification code modification

      const admin = await Admin.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true }
      ).populate('user', 'username email');

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      res.json({
        message: "success",
        data: admin
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteAdmin: async (req, res) => {
    try {
      const admin = await Admin.findById(req.params.id);
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      // Revert user role to regular user
      await User.findByIdAndUpdate(admin.user, { role: 'user' });
      
      await Admin.findByIdAndDelete(req.params.id);
      
      res.json({
        message: "Admin deleted successfully"
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = adminController;