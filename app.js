const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoutes = require("./routes/accountRouter");
const userDailyRouter = require("./routes/userDailyRouter");
const neuralRouter = require("./routes/neuralRouter");
const mailingRouter = require("./routes/mailingRouter");
const tasksRouter = require("./routes/tasksRouter");
const tasksHook = require("./routes/hooks/tasksHook");

// app.post("/api/aiAnswer", (req, res) => {
//   try {
//     const webhookData = req.body;

//     // Проверяем наличие данных
//     if (!webhookData || !webhookData.result || !webhookData.result[0]) {
//       return res.status(400).json({ error: "Invalid data format" });
//     }

//     // Извлекаем контент сообщения
//     const content = webhookData.result[0].message.content;
//     console.log("Ответ api:", content);

//     // Пытаемся найти JSON в строке (если он вложен в текст)
//     let jsonData;
//     try {
//       // Ищем начало и конец JSON структуры
//       const jsonStart = content.indexOf("[");
//       const jsonEnd = content.lastIndexOf("]") + 1;

//       if (jsonStart !== -1 && jsonEnd !== -1) {
//         const jsonString = content.substring(jsonStart, jsonEnd);
//         jsonData = JSON.parse(jsonString);
//       } else {
//         // Если не нашли JSON структуру, возвращаем как есть
//         jsonData = content;
//       }
//     } catch (e) {
//       console.error("Ошибка парсинга JSON:", e);
//       jsonData = content;
//     }

//     // Возвращаем структурированный ответ
//     res.status(200).json({
//       success: true,
//       data: jsonData,
//       original: webhookData,
//     });
//   } catch (error) {
//     console.error("Ошибка обработки ответа:", error);
//     res.status(500).json({
//       error: "Internal server error",
//       details: error.message,
//     });
//   }
// });

app.use("/api", authRoutes);
app.use("/api", userDailyRouter);
app.use("/api", neuralRouter);
app.use("/api", tasksRouter);
app.use("/api", mailingRouter);
app.use("/api", tasksHook);

app.get("/", (req, res) => {
  res.json({ message: "API is working" });
});

// Обработка 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
