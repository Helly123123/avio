const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class UserMailing {
  static async findByUserId(user_id) {
    const [rows] = await pool.query(
      "SELECT * FROM mailings WHERE user_id = ?",
      [user_id]
    );
    return rows[0];
  }

  static async update(userId, value) {
    await pool.query(
      `UPDATE mailings SET 
        is_active = ?
      WHERE user_id = ?`,
      [value, userId]
    );

    return true;
  }

  static async create(userData, value) {
    const { userId, firstName, lastName, username, chatId, languageCode } =
      userData;

    const [rows] = await pool.query(
      "SELECT * FROM mailings WHERE user_id = ?",
      [userId]
    );

    if (rows[0]) {
      return;
    }
    const uuid = uuidv4();

    const [result] = await pool.query(
      `INSERT INTO mailings 
      (uuid, user_id, first_name, last_name, username, chat_id, language_code, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        userId,
        firstName,
        lastName,
        username || null,
        chatId || null,
        languageCode || null,
        value,
      ]
    );

    return { id: result.insertId, userId };
  }
}

module.exports = UserMailing;
