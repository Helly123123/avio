const { json } = require("express");
const UserDaily = require("../../models/UserDaily");
const UserDailyData = require("../../models/UserDailyData");
const { decodeAndVerifyJWT } = require('../../utils/decodeToken');



module.exports = async (req, res) => {
  try {
    const {
      sleep_time,
      meals,
      energy_level,
      work_schedule,
      stress_level,
      physical_activity,
      recreation_preferences,
      time_awakening,
      day,
    } = req.body;
    
    const data = {
      sleep_time,
      meals,
      energy_level,
      work_schedule,
      stress_level,
      physical_activity,
      recreation_preferences,
      time_awakening,
    };

    const token = req.headers.authorization?.split(" ")[1];

    const decoded = decodeAndVerifyJWT(token);
    console.log(decoded)
    if (!decoded.success) {
      return res.status(401).json({
        message: "Ошибка при проверке токена"
      })
    }

    if (
      (energy_level !== undefined && isNaN(parseInt(energy_level))) ||
      (stress_level !== undefined && isNaN(parseInt(stress_level))) ||
      (physical_activity !== undefined && isNaN(parseInt(physical_activity)))
    ) {
      return res.status(400).json({
        message:
          "energy_level, stress_level и physical_activity должны быть числами",
      });
    }

    const checkUser = await UserDaily.findByName(decoded.data.email);
    if (!checkUser) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const checkDaily = await UserDaily.getUserFullDataByName(decoded.data.email, day);
    let result;
    if (checkDaily && checkDaily.has_daily_data) {
      const updateData = await UserDailyData.updateDataUser(decoded.data.email, day, data);
      console.log(updateData);
      result = await UserDaily.update(decoded.data.email, JSON.stringify(updateData));
      return res.status(200).json({
        message: "Данные пользователя успешно обновлены",
        email: decoded.data.email,
      });
    } else {
      const getDataUser = await UserDailyData.getUserData(day, data);
      console.log(getDataUser);
      if (getDataUser) {
        result = await UserDaily.create(JSON.stringify(getDataUser), decoded.data.email, decoded.data.uuid);
        return res.status(201).json({
          message: "Данные пользователя успешно созданы",
          id: result.id,
          email: decoded.data.email,
        });
      }
    }
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    return res.status(500).json({
      message: error.message || "Ошибка при сохранении данных пользователя",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};
