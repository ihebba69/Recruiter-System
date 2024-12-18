// routes/authRouter.js
const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');

router.post('/register', authController.register);
router.get('/verify/:code', authController.verify);
router.post('/login', authController.login);
router.post('/refreshToken', authController.refreshToken);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:token', authController.resetPassword);
router.post('/logout', authController.logout);
router.get('/', authController.getUsers);

module.exports = router;
