const express = require("express");
const router = express.Router();
const giveRecommendations = require("../controllers/requestNeuralNetwork/giveRecommendations");
const createTasks = require("../controllers/requestNeuralNetwork/createTasks");
const authMiddleware = require("../middleware/authMiddlewareToken");

router.post("/giveRecommendations", authMiddleware, giveRecommendations);
router.post("/createTasks", authMiddleware, createTasks);

module.exports = router;
