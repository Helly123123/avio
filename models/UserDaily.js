const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class UserDaily {
  static async create(userData, email, uuid) {
    // const {
    //   sleep_time,
    //   meals,
    //   energy_level,
    //   work_schedule,
    //   stress_level,
    //   physical_activity,
    //   recreation_preferences,
    //   time_awakening,
    // } = userData;

    if (!email) {
      throw new Error("email обязателен");
    }

    // const mealsValue =
    //   typeof meals === "object" ? JSON.stringify(meals) : meals;
    // const workScheduleValue =
    //   typeof work_schedule === "object"
    //     ? JSON.stringify(work_schedule)
    //     : work_schedule;
    // const recreationPreferencesValue =
    //   typeof recreation_preferences === "object"
    //     ? JSON.stringify(recreation_preferences)
    //     : recreation_preferences;

    const [existingRows] = await pool.query(
      "SELECT * FROM usersDaily WHERE email = ?",
      [email]
    );
    if (existingRows.length) {
      throw new Error("Запись для данного email уже существует");
    }

    

    const [result] = await pool.query(
      `INSERT INTO usersDaily
      (uuid, email, data) 
      VALUES (?, ?, ?)`,
      [uuid, email, userData]
    );

    return { id: result.insertId, email };
  }

  static async update(email, updateData) {
    if (!email) {
      throw new Error("email обязателен");
    }

    // const mealsValue =
    //   typeof meals === "object" ? JSON.stringify(meals) : meals;
    // const workScheduleValue =
    //   typeof work_schedule === "object"
    //     ? JSON.stringify(work_schedule)
    //     : work_schedule;
    // const recreationPreferencesValue =
    //   typeof recreation_preferences === "object"
    //     ? JSON.stringify(recreation_preferences)
    //     : recreation_preferences;

    const [result] = await pool.query(
      `UPDATE usersDaily SET 
        data = ?
      WHERE email = ?`,
      [updateData, email]
    );

    if (result.affectedRows === 0) {
      throw new Error("Запись для данного email не найдена");
    }

    return { success: true, email };
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

  static async findByName(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }

  static async getUserFullDataByName(email, day) {
    try {
      const [userRows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      if (!userRows.length) {
        return null;
      }

      const [dailyRows] = await pool.query(
        "SELECT * FROM usersDaily WHERE email = ?",
        [email]
      );

      const userData = userRows[0];
      const dailyData = dailyRows.length ? dailyRows[0] : false;
      console.log(dailyData);
      if (!dailyData) {
        return {
          has_daily_data: false,
        };
      }
      const parsedData = JSON.parse(dailyData.data);
      const dayData = parsedData[day.toLowerCase()] || {};

      console.log(dayData);

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
          sleep_time: dayData.sleep_time,
          meals: safeJsonParse(dayData.meals),
          energy_level: dayData.energy_level,
          work_schedule: safeJsonParse(dayData.work_schedule),
          stress_level: dayData.stress_level,
          physical_activity: dayData.physical_activity,
          recreation_preferences: safeJsonParse(dayData.recreation_preferences),
          time_awakening: dayData.time_awakening,
          has_daily_data: true,
        }),
      };
    } catch (error) {
      console.error("Ошибка при получении полных данных пользователя:", error);
      throw error;
    }
  }

  static async checkUserName(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }
}

module.exports = UserDaily;
