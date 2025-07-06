const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class TaskManager {
  static async getAllTasksByNumber(login, created_at) {
    const [rows] = await pool.query(
      `SELECT * FROM ${login}_tasks WHERE created_at = ?`,
      [created_at]
    );
    return rows;
  }

  static async createTasks(login, tasks) {
    const createdTasks = [];

    for (const task of tasks) {
      const { text } = task;
      const uuid = uuidv4();

      const [result] = await pool.query(
        `INSERT INTO ${login}_tasks 
        (uuid, text, status, time, created_at) 
        VALUES (?, ?, ?, ?, CURRENT_DATE)`,
        [uuid, text, 0]
      );

      createdTasks.push({
        id: result.insertId,
        uuid,
        text,
        status: 0,
      });
    }

    return createdTasks;
  }

  static async updateTaskStatus(login, uuid, status) {
    try {
      const [result] = await pool.query(
        `UPDATE ${login}_tasks SET 
        status = ? 
      WHERE uuid = ?`,
        [status, uuid]
      );

      return result.affectedRows > 0;
    } catch (error) {
      console.error("Error updating task status:", error);
      return false;
    }
  }
}

module.exports = TaskManager;
