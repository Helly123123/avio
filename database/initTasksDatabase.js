const mysql = require("mysql2/promise");
require("dotenv").config();

async function initializeTasks(userLogin) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      port: process.env.DB_PORT || 3306,
    });

    const dbName = connection.escapeId(process.env.DB_NAME || "auth_db");
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`🟢 База данных ${dbName} создана или уже существует`);

    await connection.query(`USE ${dbName}`);

    const nameDatabase = userLogin + "_tasks";

    await connection.query(`
    CREATE TABLE IF NOT EXISTS ${nameDatabase} (
      uuid VARCHAR(36) UNIQUE,
      text TEXT NOT NULL,
      status TINYINT(1),
      time TEXT,
      created_at DATE DEFAULT (CURRENT_DATE)
    )
    `);

    console.log(`🟢 Таблица '${nameDatabase}' создана или уже существует`);
  } catch (error) {
    console.error("❌ Ошибка инициализации БД:", error.message);
    throw error;
  } finally {
    if (connection) await connection.end();
  }
}

module.exports = initializeTasks;
