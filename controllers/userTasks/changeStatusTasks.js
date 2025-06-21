const axios = require("axios");
require("dotenv").config();
const UserDaily = require("../../models/UserDaily");
const params = require("../../config/params");
const TaskManager = require("../../models/userTasks");

module.exports = async (req, res) => {
  try {
    const { login, uuid, status } = req.body;

    if ((!login || !uuid, !status)) {
      return res.status(404).json({
        message: "login, status, uuid обязательны",
      });
    }

    const updateTaskStatus = await TaskManager.updateTaskStatus(
      login,
      uuid,
      status
    );
    if (updateTaskStatus) {
      res.status(200).json({
        data: updateTaskStatus,
      });
    } else {
      res.status(200).json({
        message: "Такой задачи нет",
      });
    }
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
