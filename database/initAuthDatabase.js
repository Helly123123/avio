const mysql = require("mysql2/promise");
require("dotenv").config();

async function initializeDatabase() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
    });

    console.log("✅ Успешное подключение к MySQL серверу");

    const dbName = connection.escapeId(process.env.DB_NAME || "auth_db");
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`🟢 База данных ${dbName} создана или уже существует`);

    await connection.query(`USE ${dbName}`);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        uuid VARCHAR(36) UNIQUE,
        login VARCHAR(50) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        age INT,
        purpose VARCHAR(50),
        typeWork VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified TINYINT(1) DEFAULT 0,
        subscription INT
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS auth_codes (
        login VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        code INT,
        verified TINYINT(1) DEFAULT 0
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS usersDaily (
      uuid VARCHAR(36) UNIQUE,
      email VARCHAR(255) NOT NULL,
      data TEXT
    )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS recommendationsLogs (
      request_id INT,
      model TEXT,
      status TEXT,
      cost INT,
      login TEXT
    )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS tasksLogs (
      request_id INT,
      model TEXT,
      status TEXT,
      cost INT,
      login TEXT
    )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS mailings (
        uuid VARCHAR(36) UNIQUE,
        user_id INT NOT NULL,
        first_name VARCHAR(255),
        last_name VARCHAR(255),
        username VARCHAR(255),
        chat_id INT NOT NULL,
        language_code VARCHAR(255),
        is_active TINYINT(1)
      )
    `);

    console.log("🟢 Таблица 'users' создана или уже существует");
  } catch (error) {
    console.error("❌ Ошибка инициализации БД:", error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = initializeDatabase;
