const axios = require("axios");
require("dotenv").config();

module.exports = async (req, res) => {
  try {
    const webhookData = req.body;

    if (!webhookData || !webhookData.result || !webhookData.result[0]) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Получаем содержимое сообщения ассистента
    const assistantMessage = webhookData.result[0].message.content;

    // Парсим JSON из строки
    let parsedData;
    try {
      parsedData = JSON.parse(assistantMessage);
    } catch (parseError) {
      console.error("Ошибка парсинга JSON:", parseError);
      return res.status(400).json({ error: "Invalid JSON format in message" });
    }

    // Извлекаем только рекомендации
    const recommendations = parsedData.recommendations || [];
    console.log(recommendations);
    res.status(200).json({
      success: true,
      recommendations: recommendations,
    });
  } catch (error) {
    console.error("Ошибка обработки ответа:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
