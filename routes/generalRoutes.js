const express = require("express");
const {
  connectedToWatsapp,
  disconnectedFromWatsapp,
  getAllSession,
  deleteSession,
} = require("../controller/generalController");
const generalRouter = express.Router();

generalRouter
  .route("/connect-watsapp")
  .post(connectedToWatsapp)
  .delete(disconnectedFromWatsapp);

generalRouter.route("/session").get(getAllSession);

generalRouter.route("/session/:session_id").delete(deleteSession);

module.exports = generalRouter;
