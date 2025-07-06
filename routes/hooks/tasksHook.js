const express = require("express");
const router = express.Router();
const tasksHook = require("../../controllers/hooks/tasksHooks");
const authMiddleware = require("../../middleware/authMiddlewareToken");

router.post("/hooks/tasksHooks", tasksHook);

module.exports = router;
