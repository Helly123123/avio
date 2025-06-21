const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
const createTasks = require("../../database/initTasksDatabase");
// Проверка при загрузке модуля
if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET не загружен");
  process.exit(1);
}

module.exports = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: errors.array()[0].msg,
        },
      });
    }

    const { login, password, email, user_id } = req.body;
    const { age, purpose, typeWork, chat_id } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Некорректный формат email",
      });
    }

    const existingByEmail = await User.findByEmail(email);
    const existingById = await User.findByUserId(user_id);

    if (existingByEmail || existingById) {
      return res.status(401).json({
        message: "Пользователь с таким email или login уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      login,
      password: hashedPassword,
      email,
      age,
      purpose,
      typeWork,
      user_id,
      chat_id,
    });

    // Генерация JWT токена
    const token = jwt.sign(
      {
        userId: user_id, // Используем user_id из таблицы users
        email: email,
        login: login,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      token, // Добавляем токен в ответ
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        login: newUser.login,
        // Можно добавить и другие поля, если нужно:
        age: newUser.age,
        purpose: newUser.purpose,
        typeWork: newUser.typeWork,
      },
    });

    createTasks(newUser.login);
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(401).json({
      message: "Ошибка при регистрации пользователя",
      // Только для разработки:
      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};
