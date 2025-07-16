const axios = require("axios");
require("dotenv").config();
const GptLogs = require("../../models/gptLogs");
const TaskManager = require("../../models/userTasks");
const { parseGptResponse } = require("../../utils/dataParser");
const { sendToFrontend } = require("../../utils/sendToFrontend");

module.exports = async (req, res) => {
  try {
    const webhookData = req.body;

    if (!webhookData || !webhookData.result || !webhookData.result[0]) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    const content = webhookData.result[0].message.content;
    console.log("Ответ api:", content);

    const [updateStatus, updateCost] = await Promise.all([
      GptLogs.updateStatusTasks(webhookData.request_id, webhookData.status),
      GptLogs.updateCostTasks(webhookData.request_id, webhookData.cost),
    ]);

    const jsonData = parseGptResponse(content);

    const getLogin = await GptLogs.getLogin(webhookData.request_id);
    const createdTasks = await TaskManager.createTasks(
      getLogin.login,
      jsonData
    );
    console.log(createdTasks);

    if (process.env.FRONTEND_WEBHOOK_URL) {
      try {
        await sendToFrontend(process.env.FRONTEND_WEBHOOK_URL, {
          success: true,
          data: jsonData,
          original: webhookData,
          status: updateStatus,
          cost: updateCost,
          tasks: createdTasks,
        });
      } catch (frontendError) {
        console.error("Ошибка отправки на фронтенд:", frontendError);
      }
    }

    res.status(200).json({
      success: true,
      data: jsonData,
      original: webhookData,
      status: updateStatus,
      cost: updateCost,
      tasks: createdTasks,
    });
  } catch (error) {
    console.error("Ошибка обработки ответа:", error);

    // Попытка отправить ошибку на фронтенд
    if (process.env.FRONTEND_WEBHOOK_URL) {
      try {
        await sendToFrontend(process.env.FRONTEND_WEBHOOK_URL, {
          error: "Internal server error",
          details: error.message,
        });
      } catch (frontendError) {
        console.error("Ошибка отправки ошибки на фронтенд:", frontendError);
      }
    }

    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
