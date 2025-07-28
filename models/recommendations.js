const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class Recommendations {
  static async create(uuid, request_id, data) {
    if (!uuid || !request_id || !data) {
      throw new Error("Нет нужных данных");
    }

    // Преобразуем объект data в JSON-строку
    const dataJson = JSON.stringify(data);

    // Проверяем существование записи с таким uuid
    const [existingRecords] = await pool.query(
      "SELECT id FROM recommendations WHERE uuid = ? LIMIT 1",
      [uuid]
    );

    // Если запись существует, удаляем её
    if (existingRecords.length > 0) {
      await pool.query("DELETE FROM recommendations WHERE uuid = ?", [uuid]);
    }

    const [result] = await pool.query(
      `INSERT INTO recommendations
      (uuid, request_id, data) 
      VALUES (?, ?, ?)`,
      [uuid, request_id, dataJson]
    );

    return result;
  }
}

module.exports = Recommendations;
