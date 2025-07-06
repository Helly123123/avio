const axios = require("axios");
require("dotenv").config();

const TaskManager = require("../../models/userTasks");

module.exports = async (req, res) => {
  try {
    const webhookData = req.body;

    if (!webhookData || !webhookData.result || !webhookData.result[0]) {
      return res.status(400).json({ error: "Invalid data format" });
    }
    const content = webhookData.result[0].message.content;
    console.log("Ответ api:", content);

    let jsonData;
    try {
      const jsonStart = content.indexOf("[");
      const jsonEnd = content.lastIndexOf("]") + 1;

      if (jsonStart !== -1 && jsonEnd !== -1) {
        const jsonString = content.substring(jsonStart, jsonEnd);
        jsonData = JSON.parse(jsonString);
      } else {
        jsonData = content;
      }
    } catch (e) {
      console.error("Ошибка парсинга JSON:", e);
      jsonData = content;
    }

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
