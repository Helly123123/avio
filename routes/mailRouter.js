const express = require("express");
const router = express.Router();
const {
  sendVerificationCode,
} = require("../controllers/sendCode/mailingController");

router.post("/send-code", sendVerificationCode);

module.exports = router;
