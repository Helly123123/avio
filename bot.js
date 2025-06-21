const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const UserMailing = require("./models/mailings");

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
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

  const createMailingUser = UserMailing.create(userInfo, 0);
  bot.sendMessage(chatId, `ДОКС: ${JSON.stringify(userInfo, null, 2)}`);
  if (createMailingUser) {
    bot.sendMessage(chatId, `Ты добавлен в рассылку`);
  } else {
    bot.sendMessage(chatId, `Ты уронил сервер`);
  }
});

bot.on("polling_error", (error) => {
  console.error("error:", error);
});

module.exports = bot;
