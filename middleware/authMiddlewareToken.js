const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    // 1. Проверка заголовка Authorization
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Требуется авторизация. Не предоставлен Bearer токен",
      });
    }

    // 2. Извлечение токена
    const token = authHeader.split(" ")[1].trim();
    if (!token) {
      return res.status(401).json({
        message: "Неверный формат токена",
      });
    }

    // 3. Верификация токена
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Поиск пользователя по ID (предпочтительно) или имени
    let user;
    if (decoded.userId) {
      user = await User.findByUserId(decoded.userId);
    } else if (decoded.login) {
      user = await User.findByUserId(decoded.login);
    }

    if (!user) {
      return res.status(401).json({
        message: "Пользователь не найден",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Ошибка проверки токена:", error);

    if (error.login === "TokenExpiredError") {
      return res.status(401).json({
        message: "Срок действия токена истек",
      });
    }

    if (error.login === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Недействительный токен",
      });
    }

    res.status(500).json({
      message: "Ошибка при проверке авторизации",
      error: error.message,
    });
  }
};
