const axios = require("axios");
require("dotenv").config();
const UserDaily = require("../../models/UserDaily");
const params = require("../../config/params");

module.exports = async (req, res) => {
  try {
    const apiToken = process.env.GEN_API_TOKEN;
    if (!apiToken) {
      return res.status(500).json({
        message: "API токен не настроен в .env (GEN_API_TOKEN)",
      });
    }

    const { login, day } = req.body;

    if (!login) {
      return res.status(500).json({
        message: "login Обязателен",
      });
    }

    if (!day) {
      return res.status(500).json({
        message: "day Обязателен",
      });
    }

    let paramsUser;
    const userData = await UserDaily.getUserFullDataByName(login, day);
    if (userData) {
      paramsUser = await params.giveRecommendations(
        userData.login,
        userData.age,
        userData.purpose,
        userData.typeWork,
        userData.sleep_time,
        userData.meals,
        userData.energy_level,
        userData.work_schedule.start,
        userData.work_schedule.end,
        userData.stress_level,
        userData.physical_activity,
        userData.recreation_preferences,
        userData.time_awakening,
        "Составь мне 2 рекомендации по работе и 2 рекомендации по питанию, от тебя требуется только задачи без приветственного текста"
      );
    }

    console.log(paramsUser);

    const messageUser = [{ role: "user", content: paramsUser }];

    const requestData = {
      messages: messageUser,
      callback_url: "https://webhook.site/696d45a2-3891-4601-af50-1a03178c92af",
      model: "gpt-4.1-nano",
      temperature: 0.7,
      max_tokens: 500,
    };

    const response = await axios.post(
      "https://api.gen-api.ru/api/v1/networks/gpt-4-1",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        timeout: 30000,
      }
    );

    res.json({
      data: response.data,
      user: userData || null,
    });
  } catch (error) {
    console.error("Ошибка:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });

    if (error.response?.status === 422) {
      return res.status(422).json({
        message: "Ошибка валидации данных API",
        details: error.response.data,
      });
    }

    res.status(error.response?.status || 500).json({
      message: "Ошибка при запросе к GPT API",
      error: error.message,
    });
  }
};
