require("dotenv").config();
const { parseAssistantMessage } = require("../../utils/parseAssistantMessage");
const { sendToFrontend } = require("../../utils/sendToFrontend");
const GptLogs = require("../../models/gptLogs");
const Recommendations = require("../../models/recommendations");

module.exports = async (req, res) => {
  try {
    const webhookData = req.body;

    if (!webhookData || !webhookData.result || !webhookData.result[0]) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    console.log(webhookData);

    const updateStatus = await GptLogs.updateStatus(
      webhookData.request_id,
      webhookData.status
    );

    const updateCost = await GptLogs.updateCost(
      webhookData.request_id,
      webhookData.cost
    );

    console.log(webhookData.request_id);

    const getData = await GptLogs.getAllData(webhookData.request_id);

    console.log(getData);

    const assistantMessage = webhookData.result[0].message.content;
    const recommendations = parseAssistantMessage(assistantMessage);

    const FRONTEND_WEBHOOK_URL = process.env.FRONTEND_WEBHOOK_URL;

    // console.log(recommendations[0])
    const createRecommendations = await Recommendations.create(
      getData.uuid,
      webhookData.request_id,
      { recommendations }
    );

    if (createRecommendations.affectedRows === 0) {
      await sendToFrontend(FRONTEND_WEBHOOK_URL, {
        message: "Ошибка при создании рекомандаций",
      });
    }

    await sendToFrontend(FRONTEND_WEBHOOK_URL, {
      recommendations: recommendations,
      status: updateStatus,
      cost: updateCost,
    });

    res.status(200).json({
      message: "Data processed and forwarded to frontend successfully",
    });
  } catch (error) {
    console.error("Ошибка обработки запроса:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
