const UserDaily = require("../../models/UserDaily");

module.exports = async (req, res) => {
  try {
    const {
      login,
      sleep_time,
      meals,
      energy_level,
      work_schedule,
      stress_level,
      physical_activity,
      recreation_preferences,
      time_awakening,
    } = req.body;

    // Validate required fields
    if (!login) {
      return res.status(400).json({
        message: "login обязателен",
      });
    }

    // Validate numeric fields (example, adjust based on schema)
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

    const checkUser = await UserDaily.findByName(login);
    if (!checkUser) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    const userData = {
      login,
      sleep_time,
      meals,
      energy_level,
      work_schedule,
      stress_level,
      physical_activity,
      recreation_preferences,
      time_awakening,
    };

    const checkDaily = await UserDaily.getUserFullDataByName(login);
    let result;
    if (checkDaily && checkDaily.has_daily_data) {
      result = await UserDaily.update(login, userData);
      return res.status(200).json({
        message: "Данные пользователя успешно обновлены",
        login,
      });
    } else {
      result = await UserDaily.create(userData);
      return res.status(201).json({
        message: "Данные пользователя успешно созданы",
        id: result.id,
        login,
      });
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
