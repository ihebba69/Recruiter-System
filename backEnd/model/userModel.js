// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  password: { type: String, required: true },
  address: { type: String },
  phone: { type: String },
  code: { type: String }, // Used for verification
  verify: { type: Boolean, default: false }, // Email verification status
  token: { type: String }, // For storing temporary tokens like reset password tokens
});

// Password hashing middleware
userSchema.pre("save", async function (next) {
  try {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) return next();

    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password using the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare provided password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = mongoose.model("User", userSchema);
