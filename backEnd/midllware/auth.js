// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('Authorization header missing');
    }
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
