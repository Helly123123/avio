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

require("./utils/resetLimits");

const authRoutes = require("./routes/accountRouter");
const userDailyRouter = require("./routes/userDailyRouter");
const neuralRouter = require("./routes/neuralRouter");
const mailingRouter = require("./routes/mailingRouter");
const tasksRouter = require("./routes/tasksRouter");
const tasksHook = require("./routes/hooks/tasksHook");
const recommendationsHook = require("./routes/hooks/recommendationsHook");
const mailRouter = require("./routes/mailRouter");

app.use("/api", authRoutes);
app.use("/api", userDailyRouter);
app.use("/api", neuralRouter);
app.use("/api", tasksRouter);
app.use("/api", mailingRouter);
app.use("/api", tasksHook);
app.use("/api", recommendationsHook);
app.use("/api", mailRouter);

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
