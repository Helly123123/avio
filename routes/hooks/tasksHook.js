const express = require("express");
const router = express.Router();
const tasksHook = require("../../controllers/hooks/tasksHooks");
const authMiddleware = require("../../middleware/authMiddlewareToken");

router.post("/hooks/tasksHooks", authMiddleware, tasksHook);

module.exports = router;
