const express = require("express");
const {
  LoadCampaingAndStarted,
  getWatsappCompaign,
} = require("../controller/watsappController");
const { getIO } = require("../config/socketManager");
const router = express.Router();

router.get("/send", LoadCampaingAndStarted);

router.get("/logs", getWatsappCompaign);

//@handle proccessed sheet
// router.get("/processed-sheet", );

// Health check endpoint
router.get("/health", (req, res) => {
  const io = getIO();
  io.emit("message", {
    type: "health",
    data: {
      status: "OK",
    },
  });
  res.json({ status: "OK" });
});

module.exports = router;
