const express = require("express");
const router = express.Router();
const changeUserDaily = require("../controllers/userDaily/changeUserDaily");
const authMiddleware = require("../middleware/authMiddlewareToken");

router.post("/changeUserDaily", authMiddleware, changeUserDaily);

module.exports = router;
