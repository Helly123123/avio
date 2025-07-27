const { json } = require("express");
const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class UserDailyData {
  static async getUserData(day, data) {
    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    if (!validDays.includes(day.toLowerCase())) {
      throw new Error("Недопустимый день недели");
    }

    const userData = {
      monday: {
        sleep_time: "",
        meals: [],
        energy_level: "",
        work_schedule: { start: "", end: "" },
        stress_level: "",
        physical_activity: "",
        recreation_preferences: [],
        time_awakening: "",
      },
      tuesday: {
        sleep_time: "",
        meals: [],
        energy_level: "",
        work_schedule: { start: "", end: "" },
        stress_level: "",
        physical_activity: "",
        recreation_preferences: [],
        time_awakening: "",
      },
      wednesday: {
        sleep_time: "",
        meals: [],
        energy_level: "",
        work_schedule: { start: "", end: "" },
        stress_level: "",
        physical_activity: "",
        recreation_preferences: [],
        time_awakening: "",
      },
      thursday: {
        sleep_time: "",
        meals: [],
        energy_level: "",
        work_schedule: { start: "", end: "" },
        stress_level: "",
        physical_activity: "",
        recreation_preferences: [],
        time_awakening: "",
      },
      friday: {
        sleep_time: "",
        meals: [],
        energy_level: "",
        work_schedule: { start: "", end: "" },
        stress_level: "",
        physical_activity: "",
        recreation_preferences: [],
        time_awakening: "",
      },
      saturday: {
        sleep_time: "",
        meals: [],
        energy_level: "",
        work_schedule: { start: "", end: "" },
        stress_level: "",
        physical_activity: "",
        recreation_preferences: [],
        time_awakening: "",
      },
      sunday: {
        sleep_time: "",
        meals: [],
        energy_level: "",
        work_schedule: { start: "", end: "" },
        stress_level: "",
        physical_activity: "",
        recreation_preferences: [],
        time_awakening: "",
      },
    };

    if (data) {
      userData[day.toLowerCase()] = {
        ...userData[day.toLowerCase()],
        ...data,
      };
    }

    return userData;
  }

  static async updateDataUser(login, day, data) {
    const [rows] = await pool.query(
      "SELECT data FROM usersdaily WHERE email = ?",
      [login]
    );

    const validDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    if (!validDays.includes(day.toLowerCase())) {
      throw new Error("Недопустимый день недели");
    }

    const dataUser = JSON.parse(rows[0].data);

    if (data) {
      dataUser[day.toLowerCase()] = {
        ...dataUser[day.toLowerCase()],
        ...data,
      };
    }

    return dataUser;
  }
}

module.exports = UserDailyData;
