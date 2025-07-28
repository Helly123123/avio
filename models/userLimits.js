const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class UserLimits {
  static async findByUuid(uuid) {
    const [rows] = await pool.query("SELECT * FROM userLimits WHERE uuid = ?", [
      uuid,
    ]);

    return {
      ...rows[0],
    };
  }

  static async changeRecLimit(uuid) {
    const [rows] = await pool.query("SELECT * FROM userLimits WHERE uuid = ?", [
      uuid,
    ]);

    const newLimit = rows[0].recommendations - 1;

    const [update] = await pool.query(
      "UPDATE userLimits SET recommendations = ? WHERE uuid = ?",
      [newLimit, uuid]
    );
    console.log(update);
    return update[0];
  }

  static async findByUserId(login) {
    const [rows] = await pool.query("SELECT * FROM users WHERE login = ?", [
      login,
    ]);
    return rows[0];
  }

  static async create(uuid) {
    const [result] = await pool.query(
      `INSERT INTO userLimits 
      (uuid, recommendations, tasks, updateData) 
      VALUES (?, ?, ?, ?)`,
      [uuid, 3, 3, 0]
    );
    console.log(result);
    return {
      id: result.insertId,
      uuid,
      recommendations: 3,
      tasks: 3,
      updateData: 0,
      affectedRows: result.affectedRows,
    };
  }

  static async updateSubscription(uuid) {
    const [result] = await pool.query(
      "UPDATE userLimits SET recommendations = ?, tasks = ? WHERE uuid = ?",
      [10, 10, uuid]
    );
    console.log(result);
    return {
      recommendations: 10,
      tasks: 10,
      updateData: 0,
      affectedRows: result.affectedRows,
    };
  }

  static async resetAllLimits() {
    try {
      const [users] = await pool.query("SELECT uuid, subscription FROM users");

      if (users.length === 0) {
        return { affectedRows: 0, message: "Нет пользователей для обновления" };
      }

      const withSubscription = users
        .filter((u) => u.subscription === 1)
        .map((u) => u.uuid);
      const withoutSubscription = users
        .filter((u) => u.subscription !== 1)
        .map((u) => u.uuid);

      let totalAffected = 0;

      if (withSubscription.length > 0) {
        const [resultPro] = await pool.query(
          "UPDATE userLimits SET recommendations = 10, tasks = 10 WHERE uuid IN (?)",
          [withSubscription]
        );
        totalAffected += resultPro.affectedRows;
      }

      if (withoutSubscription.length > 0) {
        const [resultBasic] = await pool.query(
          "UPDATE userLimits SET recommendations = 3, tasks = 3 WHERE uuid IN (?)",
          [withoutSubscription]
        );
        totalAffected += resultBasic.affectedRows;
      }

      return {
        affectedRows: totalAffected,
        message: `Обновлено ${totalAffected} записей (${withSubscription.length} с подпиской, ${withoutSubscription.length} без)`,
      };
    } catch (err) {
      console.error("Ошибка в resetAllLimits:", err);
      throw err;
    }
  }

  static async updateUserData(email, userData) {
    const { age, purpose, typeWork } = userData;

    const [result] = await pool.query(
      `UPDATE users 
       SET age = ?, purpose = ?, typeWork = ? 
       WHERE email = ?`,
      [age || null, purpose || null, typeWork || null, email]
    );

    console.log(result);
    return {
      email,
      age,
      purpose,
      typeWork,
    };
  }
}

module.exports = UserLimits;
