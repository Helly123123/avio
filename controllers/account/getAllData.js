const User = require("../../models/User");
const UserLimits = require("../../models/userLimits");
const { decodeAndVerifyJWT } = require("../../utils/decodeToken");

module.exports = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const decoded = decodeAndVerifyJWT(token);

    if (!decoded.success) {
      return res.status(401).json({
        message: "Ошибка при проверке токена",
      });
    }

    if (decoded.success) {
      const getAllData = await User.getAllData(decoded.data.uuid);
      console.log(getAllData);
      res.status(200).json({
        data: getAllData,
      });
    }
  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(401).json({
      message: "Ошибка при авторизации",
    });
  }
};
