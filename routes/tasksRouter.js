const express = require("express");
const router = express.Router();
const getTasks = require("../controllers/userTasks/getTasks");
const updateStatusTasks = require("../controllers/userTasks/changeStatusTasks");
const authMiddleware = require("../middleware/authMiddlewareToken");

router.get("/getTasks", authMiddleware, getTasks);
router.post("/updateStatusTasks", authMiddleware, updateStatusTasks);

module.exports = router;
