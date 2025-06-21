const express = require("express");
const router = express.Router();
const changeMailingStation = require("../controllers/mailing/changeMailingStation");
const authMiddleware = require("../middleware/authMiddlewareToken");

router.post("/changeMailingStation", authMiddleware, changeMailingStation);

module.exports = router;
