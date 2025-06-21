const axios = require("axios");
require("dotenv").config();
const UserDaily = require("../../models/UserDaily");
const params = require("../../config/params");
const TaskManager = require("../../models/userTasks");

module.exports = async (req, res) => {
  try {
    const { login, created_at } = req.body;

    if (!login || !created_at) {
      return res.status(404).json({
        message: "login и created_at обязательны",
      });
    }

    const getTasks = await TaskManager.getAllTasksByNumber(login, created_at);
    console.log(getTasks);

    res.status(200).json({
      data: getTasks,
    });
  } catch (error) {
    console.error("Ошибка:", {
      message: error.message,
    });

    res.status(500).json({
      message: "Ошибка",
      error: error.message,
    });
  }
};
