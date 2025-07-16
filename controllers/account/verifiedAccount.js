const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
require("dotenv").config();
const createTasks = require("../../database/initTasksDatabase");
const { sendVerificationCode } = require("../sendCode/mailingController");
const authCode = require("../../models/authCode");

module.exports = async (req, res) => {
  try {
    const { email, code } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Некорректный формат email",
      });
    }

    const existingByEmail = await User.findByEmail(email);

    if (!existingByEmail) {
      return res.status(401).json({
        message: "Аккаунт не найден",
      });
    }
    const getCode = await authCode.getUserCode(email);
    console.log(getCode.code);
    if (getCode.code === code) {
      const updateCode = await authCode.update(email);
      if (updateCode === 1) {
        return res.status(200).json({
          message: "Аккаунт успешно верифицирован",
        });
      } else {
        return res.status(401).json({
          message: "Ошибка при верификации аккаунта",
        });
      }
    } else {
      return res.status(401).json({
        message: "Неверный код верификации",
      });
    }
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
