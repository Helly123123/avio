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

    const { login, password, email } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Некорректный формат email",
      });
    }

    const existingByEmail = await User.findByEmail(email);

    if (existingByEmail.email) {
      return res.status(401).json({
        message: "Пользователь с таким email или login уже существует",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      login,
      password: hashedPassword,
      email,
    });

    const token = jwt.sign(
      {
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
          user: {
            email: newUser.email,
            login: newUser.login,
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
