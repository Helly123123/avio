const express = require("express");
const router = express.Router();
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validators/authValidator");
const registerController = require("../controllers/account/register");
const loginController = require("../controllers/account/login");
const verifiedAccountController = require("../controllers/account/verifiedAccount");
const updateUserDataController = require("../controllers/account/accountData");
const authMiddleware = require("../middleware/authMiddlewareToken");
const changeSubscriptionController = require("../controllers/account/changeSubscription");
const getAllData = require("../controllers/account/getAllData");


router.post("/register", registerValidator, registerController);

router.post("/login", loginValidator, loginController);

router.post("/verifiedAccount", verifiedAccountController);

router.post("/changeSubscription", authMiddleware, changeSubscriptionController);

router.post("/getAllData", authMiddleware, getAllData);

router.put("/updateUserData", authMiddleware, updateUserDataController);

module.exports = router;
