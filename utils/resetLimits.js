// utils/limit-reset.js
const cron = require('node-cron');
const UserLimits = require('../models/userLimits');

class LimitResetScheduler {
  constructor() {
    this.init();
  }

  init() {
    
    cron.schedule('11 13 * * *', () => {
      console.log(`[Limit Reset] ${new Date().toLocaleString()} — Сброс лимитов для всех пользователей`);
      this.resetAllLimits();
    }, {
      timezone: "Europe/Moscow"
    });

    this.resetAllLimits();
  }

  async resetAllLimits() {
    try {
      const result = await UserLimits.resetAllLimits();
      
      console.log(
        result.affectedRows > 0
          ? `[Limit Reset] Успешно! Обновлено пользователей: ${result.affectedRows}`
          : '[Limit Reset] Нет данных для обновления'
      );
    } catch (err) {
      console.error('[Limit Reset] Ошибка:', err.message);
      // Можно добавить отправку ошибки в Sentry/Telegram
    }
  }
}

module.exports = new LimitResetScheduler();