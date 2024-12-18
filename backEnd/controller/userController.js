const userModel = require("../model/userModel");

// Create a new user
const createUser = async (req, res) => {
  try {
    const user = new userModel(req.body);
    await user.save();
    res.status(201).json({
      message: 'success',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      message: 'error',
      data: null
    });
  }
};

// List all users
const listUser = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({
      message: 'success',
      data: users
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      data: null
    });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        data: null
      });
    }
    res.status(200).json({
      message: 'success',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      data: null
    });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        data: null
      });
    }
    res.status(200).json({
      message: 'success',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      data: null
    });
  }
};

// Get a user by ID
const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        data: null
      });
    }
    res.status(200).json({
      message: 'success',
      data: user
    });
  } catch (error) {
    res.status(400).json({
      message: 'failed',
      data: null
    });
  }
};

module.exports = { createUser, listUser, updateUser, deleteUser, getUser };
