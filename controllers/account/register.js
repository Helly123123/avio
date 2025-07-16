const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
const createTasks = require("../../database/initTasksDatabase");
const { sendVerificationCode } = require("../sendCode/mailingController");
const authCode = require("../../models/authCode");

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

    const token = jwt.sign(
      {
        userId: user_id,
        email: email,
        login: login,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    if (newUser.affectedRows === 1) {
      async function generateSixDigitCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
      }

      const code = await generateSixDigitCode();
      const success = await sendVerificationCode(email, code);
      if (success) {
        await authCode.create(email, login, code);
        res.status(201).json({
          token,
          sendCode: true,
          user: {
            email: newUser.email,
            login: newUser.login,
            age: newUser.age || null,
            purpose: newUser.purpose || null,
            typeWork: newUser.typeWork || null,
            verified: 0,
            subscription: 0,
          },
        });
      }
    } else {
      res.status(404).json({
        error: {
          message: "Ошибка при регистрации пользователя",
        },
      });
    }

    createTasks(newUser.login);
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    res.status(401).json({
      message: "Ошибка при регистрации пользователя",

      ...(process.env.NODE_ENV === "development" && {
        error: error.message,
      }),
    });
  }
};
