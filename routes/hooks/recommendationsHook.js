const express = require("express");
const router = express.Router();
const recommendationsHook = require("../../controllers/hooks/recommendationsHook");
const authMiddleware = require("../../middleware/authMiddlewareToken");

router.post("/hooks/recommendationsHook", recommendationsHook);

module.exports = router;
