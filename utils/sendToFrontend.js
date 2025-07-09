const axios = require("axios");

async function sendToFrontend(frontendUrl, data) {
  try {
    if (!frontendUrl) {
      throw new Error("Frontend URL is not defined");
    }

    const response = await axios.post(frontendUrl, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Ошибка при отправке данных на фронтенд:", error);
    throw error;
  }
}

module.exports = { sendToFrontend };
