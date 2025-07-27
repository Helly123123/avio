const User = require("../../models/User");
const UserLimits = require("../../models/userLimits");


module.exports = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email обязателен",
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
    
    const changeSubscription = await User.changeSubscription(email);
    console.log(changeSubscription);
    const updateSubscription = await UserLimits.updateSubscription(user.uuid);
    console.log(updateSubscription);
    
    res.status(200).json({
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
        recommendations: updateSubscription.recommendations,
        tasks: updateSubscription.tasks,
      },
    });

  } catch (error) {
    console.error("Ошибка авторизации:", error);
    res.status(401).json({
      message: "Ошибка при авторизации",
    });
  }
};
