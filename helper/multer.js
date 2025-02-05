const multer = require("multer");
const fs = require("fs-extra");

// Define the upload directory
const uploadDir = "uploads/";

// Ensure upload directory exists
fs.ensureDirSync(uploadDir);

const fileNameSave = (file) => {
  const ext = file.originalname.split(".").pop();
  if (file.fieldname === "imageUrl") {
    fileSave = "image." + ext;
  } else if (file.fieldname === "documentUrl") {
    fileSave = "doc." + ext;
  } else if (file.fieldname === "audioUrl") {
    fileSave = "audio." + ext;
  } else {
    fileSave = file.originalname;
  }
  return fileSave;
};

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    let fileSave = fileNameSave(file);
    cb(null, `${fileSave}`);
  },
});

// Multer Upload Config with File Limit (Max: 5MB)
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB Limit
});

// Middleware to delete file after processing
const cleanupFile = (filePath) => {
  fs.remove(filePath)
    .then(() => console.log(`Deleted: ${filePath}`))
    .catch((err) => console.error(`Error deleting file: ${err}`));
};

module.exports = { upload, cleanupFile, fileNameSave };
