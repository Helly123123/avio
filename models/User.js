const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    const [daily] = await pool.query(
      "SELECT * FROM usersDaily WHERE email = ?",
      [email]
    );

    console.log(daily, rows[0]);

    if (daily.length === 0) {
      return {
        ...rows[0],
        daily: null,
      };
    }

    return {
      ...rows[0],
      daily: JSON.parse(daily[0].data),
    };
  }

  static async changeSubscription(email) {
    const [result] = await pool.query(
      "UPDATE users SET subscription = ? WHERE email = ?",
      [1, email]
    );
    console.log(result);
    return result;
  }

  static async getDataForDay(uuid, day) {
    try {
      const [user] = await pool.query("SELECT * FROM users WHERE uuid = ?", [
        uuid,
      ]);

      const [daily] = await pool.query(
        "SELECT * FROM usersDaily WHERE uuid = ?",
        [uuid]
      );

      if (!daily[0]) {
        return {
          user: user[0],
          daily: "Waiting added",
        };
      }
      const parsedData = JSON.parse(daily[0].data);
      const dayData = parsedData[day.toLowerCase()] || {};

      return {
        user: {
          login: user[0].login,
          email: user[0].email,
          age: user[0].age || "Waiting added",
          purpose: user[0].purpose || "Waiting added",
          typeWork: user[0].typeWork || "Waiting added",
        },

        daily: {
          sleep_time: dayData.sleep_time || "Waiting added",
          meals: dayData.meals || "Waiting added",
          energy_level: dayData.energy_level || "Waiting added",
          work_schedule: {
            start: dayData.work_schedule.start || "Waiting added",
            end: dayData.work_schedule.end || "Waiting added",
          },
          stress_level: dayData.stress_level || "Waiting added",
          physical_activity: dayData.physical_activity || "Waiting added",
          recreation_preferences:
            dayData.recreation_preferences || "Waiting added",
          time_awakening: dayData.time_awakening || "Waiting added",
        },
      };
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      throw error;
    }
  }

  static async getAllData(uuid) {
    try {
      const [daily] = await pool.query(
        "SELECT * FROM usersDaily WHERE uuid = ?",
        [uuid]
      );
      const [user] = await pool.query("SELECT * FROM users WHERE uuid = ?", [
        uuid,
      ]);

      const [userLimits] = await pool.query(
        "SELECT * FROM userLimits WHERE uuid = ?",
        [uuid]
      );
      const processDailyData = (data) => {
        if (!data) return "Waiting added";

        const days = [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ];
        const processedData = {};

        days.forEach((day) => {
          if (!data[day]) {
            processedData[day] = "Waiting added";
            return;
          }

          processedData[day] = {
            sleep_time: data[day].sleep_time || "Waiting added",
            meals:
              data[day].meals && data[day].meals.length > 0
                ? data[day].meals
                : "Waiting added",
            energy_level: data[day].energy_level || "Waiting added",
            work_schedule: {
              start: data[day].work_schedule?.start || "Waiting added",
              end: data[day].work_schedule?.end || "Waiting added",
            },
            stress_level: data[day].stress_level || "Waiting added",
            physical_activity: data[day].physical_activity || "Waiting added",
            recreation_preferences:
              data[day].recreation_preferences &&
              data[day].recreation_preferences.length > 0
                ? data[day].recreation_preferences
                : "Waiting added",
            time_awakening: data[day].time_awakening || "Waiting added",
          };
        });

        return processedData;
      };

      return {
        user: {
          login: user[0].login,
          email: user[0].email,
          age: user[0].age || "Waiting added",
          purpose: user[0].purpose || "Waiting added",
          typeWork: user[0].typeWork || "Waiting added",
          verified: user[0].verified || "Waiting verification",
          subscription: user[0].subscription === 1,
        },
        daily: daily[0]?.data
          ? processDailyData(JSON.parse(daily[0].data))
          : "Waiting added",
        userLimits: {
          recommendations: userLimits[0].recommendations,
          tasks: userLimits[0].tasks,
        },
      };
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
      throw error;
    }
  }

  static async findByUserId(login) {
    const [rows] = await pool.query("SELECT * FROM users WHERE login = ?", [
      login,
    ]);
    return rows[0];
  }

  static async create(userData) {
    const { login, password, email, age, purpose, typeWork } = userData;
    const uuid = uuidv4();

    const [result] = await pool.query(
      `INSERT INTO users 
      (uuid, login, password, email, age, purpose, typeWork, subscription) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        login,
        password,
        email,
        age || null,
        purpose || null,
        typeWork || null,
        0,
      ]
    );
    console.log(result);
    return {
      id: result.insertId,
      uuid,
      login,
      email,
      age,
      purpose,
      typeWork,
      affectedRows: result.affectedRows,
    };
  }

  static async updateUserData(uuid, userData) {
    const { age, purpose, typeWork } = userData;

    const [result] = await pool.query(
      `UPDATE users 
       SET age = ?, purpose = ?, typeWork = ? 
       WHERE uuid = ?`,
      [age || null, purpose || null, typeWork || null, uuid]
    );

    console.log(result);
    return {
      uuid,
      age,
      purpose,
      typeWork,
    };
  }
}

module.exports = User;
