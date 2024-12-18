const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/hello-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

// Schema for storing messages
const messageSchema = new mongoose.Schema({
  message: String,
});

const Message = mongoose.model("Message", messageSchema);

// POST /hello endpoint
app.post("/hello", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).send("Message is required");
  }

  try {
    const newMessage = new Message({ message });
    await newMessage.save();
    res.status(200).send("Message saved successfully");
  } catch (err) {
    res.status(500).send("Error saving message");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
