const express = require("express");
const router = express.Router();
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validators/authValidator");
const registerController = require("../controllers/account/register");
const loginController = require("../controllers/account/login");

router.post("/register", registerValidator, registerController);

router.post("/login", loginValidator, loginController);

module.exports = router;
