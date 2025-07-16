const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Проверка при загрузке модуля
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET не загружен");
  process.exit(1);
}

module.exports = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email и пароль обязательны",
      });
    }

    if (email.lenght > 250 || !password.lenght > 250) {
      return res.status(400).json({
        message: "Email или пароль слишком длинные",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Некорректный формат email",
      });
    }

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: "Неверные учетные данные",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Неверные учетные данные",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT секрет не настроен");
    }

    const token = jwt.sign(
      {
        userId: user.user_id,
        email: user.email,
        login: user.login,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        login: user.login,
        email: user.email,
        age: user.age || null,
        purpose: user.purpose || null,
        typeWork: user.typeWork || null,
        verified: user.verified,
        subscription: user.subscription,
      },
      daily: user.daily
    });

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(401).json({
      message: "Ошибка при авторизации",
      // Только для разработки:
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
        stack: error.stack,
      }),
    });
  }
};
