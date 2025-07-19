const User = require("../../models/User");

const updateUserData = async (req, res) => {
  try {
    const { email, age, purpose, typeWork } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Почта не найдена",
      });
    }

    const result = await User.updateUserData(email, {
      age,
      purpose,
      typeWork,
    });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    res.json({
      message: "Данные пользователя обновлены",
      data: result,
    });
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
    res.status(500).json({
      success: false,
      message: "Внутренняя ошибка сервера",
    });
  }
};

module.exports = updateUserData;
