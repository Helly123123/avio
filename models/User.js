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
      login,
      email,
      age,
      purpose,
      typeWork,
      affectedRows: result.affectedRows,
    };
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

module.exports = User;
