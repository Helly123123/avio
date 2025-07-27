const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class GptLogs {
  static async create(request_id, model, status, uuid) {
    if (!uuid || !request_id || !model || !status) {
      throw new Error("Нет нужный данных");
    }

    const [result] = await pool.query(
      `INSERT INTO recommendationsLogs
      (uuid, request_id, model, status, cost) 
      VALUES (?, ?, ?, ?, ?)`,
      [uuid, request_id, model, status, 0]
    );

    return result;
  }

  static async updateCost(request_id, cost) {
    if (!request_id) {
      throw new Error("Нет нужный данных");
    }

    const [result] = await pool.query(
      `UPDATE recommendationsLogs SET 
        cost = ?
      WHERE request_id = ?`,
      [cost, request_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Запись для данного request_id не найдена");
    }

    return { success: true };
  }

  static async updateStatus(request_id, status) {
    if (!request_id || !status) {
      throw new Error("Нет нужный данных");
    }

    const [result] = await pool.query(
      `UPDATE recommendationsLogs SET 
        status = ?
      WHERE request_id = ?`,
      [status, request_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Запись для данного request_id не найдена");
    }

    return { success: true };
  }

  static async createTasks(request_id, model, status, login) {
    if (!login || !request_id || !model || !status) {
      throw new Error("Нет нужный данных");
    }

    const [result] = await pool.query(
      `INSERT INTO tasksLogs
      (request_id, model, status, cost, login) 
      VALUES (?, ?, ?, ?, ?)`,
      [request_id, model, status, 0, login]
    );

    return result;
  }

  static async updateCostTasks(request_id, cost) {
    if (!request_id) {
      throw new Error("Нет нужный данных");
    }

    const [result] = await pool.query(
      `UPDATE tasksLogs SET 
        cost = ?
      WHERE request_id = ?`,
      [cost, request_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Запись для данного request_id не найдена");
    }

    return { success: true };
  }

  static async updateStatusTasks(request_id, status) {
    if (!request_id || !status) {
      throw new Error("Нет нужный данных");
    }

    const [result] = await pool.query(
      `UPDATE tasksLogs SET 
        status = ?
      WHERE request_id = ?`,
      [status, request_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("Запись для данного request_id не найдена");
    }

    return { success: true };
  }

  static async getLogin(request_id) {
    const [rows] = await pool.query(
      "SELECT * FROM tasksLogs WHERE request_id = ?",
      [request_id]
    );
    return rows[0] || null;
  }
}

module.exports = GptLogs;
