const UserMailing = require("../../models/mailings");

module.exports = async (req, res) => {
  try {
    const { userId, value } = req.body;
     
    if (!userId || value === undefined) {
      return res.status(400).json({
        message: "user_id и value обязательны",
      });
    }
    
    const numericValue = parseInt(value, 10);
    if (isNaN(numericValue) || (numericValue !== 0 && numericValue !== 1)) {
      return res.status(400).json({
        message: "Некорректный формат value. Допустимы только 0 или 1",
      });
    }

    const checkUserId = await UserMailing.findByUserId(userId);

    if (!checkUserId) {
      return res.status(401).json({
        message: "Доступ запрещен",
      });
    }

    const updated = await UserMailing.update(userId, numericValue);

    if (updated) {
      return res.status(200).json({
        is_active: numericValue,
      });
    } else {
      return res.status(404).json({
        message: "Не удалось обновить статус рассылки",
      });
    }
  } catch (error) {
    console.error("Ошибка при сохранении данных:", error);
    return res.status(500).json({
      message: "Ошибка при сохранении данных пользователя",
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};
