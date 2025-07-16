const pool = require("../config/db");

class authCode {
  static async create(email, login, code) {
    if (!email || !login || !code) {
      throw new Error("email, login и code обязательны");
    }

    const [result] = await pool.query(
      `INSERT INTO auth_codes
      (email, login, code) 
      VALUES (?, ?, ?)`,
      [email, login, code]
    );

    return result.affectedRows;
  }

  static async update(email) {
    if (!email) {
      throw new Error("email и code обязательны");
    }

    const [result] = await pool.query(
      `UPDATE auth_codes SET 
        verified = ?
      WHERE email = ?`,
      [1, email]
    );

    return result.affectedRows;
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

  static async getUserCode(email) {
    try {
      const [getCode] = await pool.query(
        "SELECT code FROM auth_codes WHERE email = ?",
        [email]
      );

      return { code: getCode[0].code };
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

module.exports = authCode;
