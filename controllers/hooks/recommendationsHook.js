const axios = require("axios");
require("dotenv").config();

const TaskManager = require("../../models/userTasks");

module.exports = async (req, res) => {
  try {
    const webhookData = req.body;

    if (!webhookData || !webhookData.result || !webhookData.result[0]) {
      return res.status(400).json({ error: "Invalid data format" });
    }
    console.log(webhookData);

    console.log(createdTasks);
    res.status(200).json({
      success: true,
      data: jsonData,
      original: webhookData,
    });
  } catch (error) {
    console.error("Ошибка обработки ответа:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
