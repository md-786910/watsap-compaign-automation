const express = require("express");
const fileRouter = express.Router();
const path = require("path");
fileRouter.get("/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "..", "uploads", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      return res.status(404).send("File not found " + filename);
    }
  });
});

module.exports = fileRouter;
