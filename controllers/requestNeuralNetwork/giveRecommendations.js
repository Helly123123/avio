const axios = require("axios");
require("dotenv").config();
const UserDaily = require("../../models/UserDaily");
const GptLogs = require("../../models/gptLogs");
const params = require("../../config/params");
const { decodeAndVerifyJWT } = require("../../utils/decodeToken");

const User = require("../../models/User");

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

    const token = req.headers.authorization?.split(" ")[1];

    const decoded = await decodeAndVerifyJWT(token);
    console.log(decoded);
    const allDataUser = await User.getDataForDay(decoded.data.uuid, day);
    console.log(allDataUser);

    function hasWaitingAdded(obj) {
      for (const key in obj) {
        if (obj[key] === "Waiting added") {
          return true;
        }
        if (typeof obj[key] === "object" && obj[key] !== null) {
          if (hasWaitingAdded(obj[key])) {
            return true;
          }
        }
      }
      return false;
    }

    if (hasWaitingAdded(allDataUser)) {
      return res.status(404).json({
        message: "Не все данные заполнены",
        data: allDataUser,
      });
    }

    
    if (allDataUser) {
      paramsUser = await params.giveRecommendations(
        allDataUser.user.login,
        allDataUser.user.age,
        allDataUser.user.purpose,
        allDataUser.user.typeWork,
        allDataUser.daily.sleep_time,
        allDataUser.daily.meals,
        allDataUser.daily.energy_level,
        allDataUser.daily.work_schedule.start,
        allDataUser.daily.work_schedule.end,
        allDataUser.daily.stress_level,
        allDataUser.daily.physical_activity,
        allDataUser.daily.recreation_preferences,
        allDataUser.daily.time_awakening,
        "Составь мне 2 рекомендации по работе и 2 рекомендации по питанию, от тебя требуется только задачи без приветственного текста Мне нужно чтобы в их отправил в виде JSON, только рекомендации и ничего более, чтобы я мог парсить эти данные, мне нужно заголовок, подзаголовок  и время когда лушче выполнить эту задачу"
      );
    }

    // console.log(paramsUser);
// return
    const messageUser = [{ role: "user", content: paramsUser }];

    const requestData = {
      messages: messageUser,
      callback_url: "http://103.54.19.87:3000/api/hooks/recommendationsHook",
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

    console.log(response.data);
      
      console.log(allDataUser.user)
    const createLogs = await GptLogs.create(
      response.data.request_id,
      response.data.model,
      response.data.status,
      allDataUser.user.uuid
    );

    res.json({
      data: response.data,
      user: allDataUser.user || null,
      logs: createLogs,
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
