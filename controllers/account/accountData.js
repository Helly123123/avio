const User = require("../../models/User");
const { decodeAndVerifyJWT } = require("../../utils/decodeToken");

const updateUserData = async (req, res) => {
  try {
    const { age, purpose, typeWork } = req.body;

    if (!age || !purpose || !typeWork) {
      return res.status(400).json({
        message: "age, purpose, typeWork не могут быть пустыми",
      });
    }

    const token = req.headers.authorization?.split(" ")[1];

    const decoded = await decodeAndVerifyJWT(token);
    console.log(decoded);

    if (!decoded.success) {
      return res.status(401).json({
        message: "Ошибка при проверке токена",
      });
    }

    const result = await User.updateUserData(decoded.data.uuid, {
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
