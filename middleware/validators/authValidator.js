const { body } = require("express-validator");

module.exports.registerValidator = [
  body("login")
    .notEmpty()
    .withMessage("Имя обязательно")
    .isLength({ min: 2, max: 50 })
    .withMessage("Имя должно быть от 2 до 50 символов"),

  body("email")
    .notEmpty()
    .withMessage("Email обязателен")
    .isEmail()
    .withMessage("Некорректный email"),

  body("password")
    .notEmpty()
    .withMessage("Пароль обязателен")
    .isLength({ min: 6 })
    .withMessage("Пароль должен быть не менее 6 символов"),

  body("age")
    .optional()
    .isInt({ min: 1, max: 120 })
    .withMessage("Возраст должен быть числом от 1 до 120"),

  body("purpose").optional().isString().withMessage("Цель должна быть строкой"),

  body("typeWork")
    .optional()
    .isString()
    .withMessage("Тип работы должен быть строкой"),
];

exports.loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email обязателен")
    .isEmail()
    .withMessage("Некорректный email"),

  body("password").notEmpty().withMessage("Пароль обязателен"),
];
