const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class User {
  static async findByEmail(email) {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0];
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
      (uuid, login, password, email, age, purpose, typeWork) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuid,
        login,
        password,
        email,
        age || null,
        purpose || null,
        typeWork || null,
      ]
    );

    return { id: result.insertId, login, email };
  }
}

module.exports = User;
