const express = require("express");
const router = express.Router();
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validators/authValidator");
const registerController = require("../controllers/account/register");
const loginController = require("../controllers/account/login");
const verifiedAccountController = require("../controllers/account/verifiedAccount");

router.post("/register", registerValidator, registerController);

router.post("/login", loginValidator, loginController);

router.post("/verifiedAccount", verifiedAccountController);

module.exports = router;
