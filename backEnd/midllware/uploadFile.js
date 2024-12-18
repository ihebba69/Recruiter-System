const multer = require("multer");
const path = require("path");

// Define storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Upload files to the 'uploads/' directory
  },
  filename: function (req, file, cb) {
    // Use a unique filename for each uploaded file
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// File filter to validate file types
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allowed file types for picture and CV
    const allowedMimeTypes = {
      photo: ["image/png", "image/jpeg", "image/jpg"],
      cvFile: ["application/pdf"],
    };

    // Match the file type with allowed types based on the field name
    const fieldName = file.fieldname;
    if (allowedMimeTypes[fieldName] && allowedMimeTypes[fieldName].includes(file.mimetype)) {
      cb(null, true); // Accept file
    } else {
      cb(new Error(`Invalid file type for ${fieldName}.`)); // Reject file
    }
  },
});

module.exports = upload;