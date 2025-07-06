const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const UserMailing = require("./models/mailings");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const WEB_APP_URL = process.env.WEB_APP_URL || "https://your-mini-app-url.com";

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userInfo = {
    userId: msg.from.id,
    firstName: msg.from.first_name,
    lastName: msg.from.last_name,
    username: msg.from.username,
    chatId: msg.chat.id,
    languageCode: msg.from.language_code,
    isBot: msg.from.is_bot,
    date: new Date(msg.date * 1000).toISOString(),
  };

  try {
    const createMailingUser = await UserMailing.create(userInfo, 0);
    bot.sendMessage(chatId, `ДОКС: ${JSON.stringify(userInfo, null, 2)}`);
    if (createMailingUser) {
      bot.sendMessage(chatId, `Ты добавлен в рассылку`);
    } else {
      bot.sendMessage(chatId, `Ты уронил сервер`);
    }
  } catch (error) {
    console.error("Error creating mailing user:", error);
    bot.sendMessage(chatId, `Произошла ошибка при добавлении в рассылку`);
  }
});

bot.onText(/\/openapp/, (msg) => {
  const chatId = msg.chat.id;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "Открыть приложение",
          web_app: { url: "https://app1.developtech.ru/" },
        },
      ],
    ],
  };

  bot.sendMessage(chatId, "Нажми кнопку, чтобы открыть приложение:", {
    reply_markup: keyboard,
  });
});

// Handle polling errors
// bot.on("polling_error", (error) => {
//   console.error("Polling error:", error);
// });

module.exports = bot;
