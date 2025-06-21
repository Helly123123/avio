const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class UserDaily {
  static async create(userData) {
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
    } = userData;

    // Validate required fields
    if (!login) {
      throw new Error("login обязателен");
    }

    const mealsValue =
      typeof meals === "object" ? JSON.stringify(meals) : meals;
    const workScheduleValue =
      typeof work_schedule === "object"
        ? JSON.stringify(work_schedule)
        : work_schedule;
    const recreationPreferencesValue =
      typeof recreation_preferences === "object"
        ? JSON.stringify(recreation_preferences)
        : recreation_preferences;

    // Check if record already exists
    const [existingRows] = await pool.query(
      "SELECT * FROM usersDaily WHERE login = ?",
      [login]
    );
    if (existingRows.length) {
      throw new Error("Запись для данного login уже существует");
    }

    const uuid = uuidv4();

    const [result] = await pool.query(
      `INSERT INTO usersDaily
      (uuid, login, sleep_time, meals, energy_level, work_schedule, stress_level, physical_activity, recreation_preferences, time_awakening) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        login,
        sleep_time,
        mealsValue,
        energy_level,
        workScheduleValue,
        stress_level,
        physical_activity,
        recreationPreferencesValue,
        time_awakening,
      ]
    );

    return { id: result.insertId, login };
  }

  static async update(login, updateData) {
    const {
      sleep_time,
      meals,
      energy_level,
      work_schedule,
      stress_level,
      physical_activity,
      recreation_preferences,
      time_awakening,
    } = updateData;

    // Validate required fields
    if (!login) {
      throw new Error("login обязателен");
    }

    // Stringify JSON fields if they are objects
    const mealsValue =
      typeof meals === "object" ? JSON.stringify(meals) : meals;
    const workScheduleValue =
      typeof work_schedule === "object"
        ? JSON.stringify(work_schedule)
        : work_schedule;
    const recreationPreferencesValue =
      typeof recreation_preferences === "object"
        ? JSON.stringify(recreation_preferences)
        : recreation_preferences;

    const [result] = await pool.query(
      `UPDATE usersDaily SET 
        sleep_time = ?,
        meals = ?,
        energy_level = ?,
        work_schedule = ?,
        stress_level = ?,
        physical_activity = ?,
        recreation_preferences = ?,
        time_awakening = ?
      WHERE login = ?`,
      [
        sleep_time,
        mealsValue,
        energy_level,
        workScheduleValue,
        stress_level,
        physical_activity,
        recreationPreferencesValue,
        time_awakening,
        login,
      ]
    );

    if (result.affectedRows === 0) {
      throw new Error("Запись для данного login не найдена");
    }

    return { success: true, login };
  }

  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }

  static async findByUserId(user_id) {
    const [rows] = await pool.query("SELECT * FROM users WHERE user_id = ?", [
      user_id,
    ]);
    return rows[0] || null;
  }

  static async findByName(login) {
    const [rows] = await pool.query("SELECT * FROM users WHERE login = ?", [
      login,
    ]);
    return rows[0] || null;
  }

  static async getUserFullDataByName(login) {
    try {
      const [userRows] = await pool.query(
        "SELECT * FROM users WHERE login = ?",
        [login]
      );

      if (!userRows.length) {
        return null;
      }

      const [dailyRows] = await pool.query(
        "SELECT * FROM usersDaily WHERE login = ?",
        [login]
      );

      const userData = userRows[0];
      const dailyData = dailyRows.length ? dailyRows[0] : {};

      const safeJsonParse = (str) => {
        try {
          return str && typeof str === "string" ? JSON.parse(str) : str;
        } catch (e) {
          return str;
        }
      };

      return {
        ...userData,
        ...(dailyRows.length && {
          sleep_time: dailyData.sleep_time,
          meals: safeJsonParse(dailyData.meals),
          energy_level: dailyData.energy_level,
          work_schedule: safeJsonParse(dailyData.work_schedule),
          stress_level: dailyData.stress_level,
          physical_activity: dailyData.physical_activity,
          recreation_preferences: safeJsonParse(
            dailyData.recreation_preferences
          ),
          time_awakening: dailyData.time_awakening,
          has_daily_data: true,
        }),
      };
    } catch (error) {
      console.error("Ошибка при получении полных данных пользователя:", error);
      throw error;
    }
  }

  static async checkUserName(login) {
    const [rows] = await pool.query("SELECT * FROM users WHERE login = ?", [
      login,
    ]);
    return rows[0] || null;
  }
}

module.exports = UserDaily;
