const User = require("../../models/User");
const UserLimits = require("../../models/userLimits");
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
    console.log(user);
    if (!user) {
      return res.status(401).json({
        message: "Неверные учетные данные",
      });
    }

    const userLimits = await UserLimits.findByUuid(user.uuid);

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
        uuid: user.uuid,
        email: user.email,
        login: user.login,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      token,
      user: {
        login: user.login,
        email: user.email,
        age: user.age || "Waiting added",
        purpose: user.purpose || "Waiting added",
        typeWork: user.typeWork || "Waiting added",
        verified: user.verified || "Waiting verification",
        subscription: user.subscription,
      },
      daily: user.daily || "Waiting added",
      limits: {
        recommendations: userLimits.recommendations,
        tasks: userLimits.tasks,
      },
    });

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(401).json({
      message: "Ошибка при авторизации",
  
    });
  }
};
