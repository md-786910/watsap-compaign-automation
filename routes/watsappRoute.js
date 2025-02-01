const express = require("express");
const {
  LoadCampaingAndStarted,
  getWatsappCompaign,
} = require("../controller/watsappController");
const { getIO } = require("../config/socketManager");
const watsappRouter = express.Router();

watsappRouter.get("/send", LoadCampaingAndStarted);
watsappRouter.get("/logs", getWatsappCompaign);

// Health check endpoint
watsappRouter.get("/health", (req, res) => {
  const io = getIO();
  io.emit("message", {
    type: "health",
    data: {
      status: "OK",
    },
  });
  res.json({ status: "OK" });
});

module.exports = watsappRouter;
