const multer = require("multer");
const fs = require("fs-extra");

// Define the upload directory
const uploadDir = "uploads/";

// Ensure upload directory exists
fs.ensureDirSync(uploadDir);

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File Validation: Only accept CSV, XLSX, and PDF
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only CSV, XLSX, and PDF are allowed."),
      false
    );
  }
};

// Multer Upload Config with File Limit (Max: 5MB)
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// Middleware to delete file after processing
const cleanupFile = (filePath) => {
  fs.remove(filePath)
    .then(() => console.log(`Deleted: ${filePath}`))
    .catch((err) => console.error(`Error deleting file: ${err}`));
};

module.exports = { upload, cleanupFile };
