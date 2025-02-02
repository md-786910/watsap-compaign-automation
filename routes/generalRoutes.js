const express = require("express");
const {
  connectedToWatsapp,
  disconnectedFromWatsapp,
  getAllSession,
  deleteSession,
  createWatsappBatch,
  getWatsapBatch,
  processSheet,
  getSheet,
} = require("../controller/generalController");
const { upload } = require("../helper/multer");
const generalRouter = express.Router();

generalRouter
  .route("/connect-watsapp")
  .post(connectedToWatsapp)
  .delete(disconnectedFromWatsapp);

generalRouter.route("/session").get(getAllSession);
generalRouter.route("/session/:session_id").delete(deleteSession);

// @watsapp batch
generalRouter
  .route("/watsapp-batch")
  .get(getWatsapBatch)
  .post(createWatsappBatch);

//@process sheet
generalRouter
  .route("/process-sheet")
  .post(upload.single("file"), processSheet)
  .get(getSheet);

module.exports = generalRouter;
