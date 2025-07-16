function parseGptResponse(content) {
  try {
    const jsonStart = content.indexOf("[");
    const jsonEnd = content.lastIndexOf("]") + 1;

    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = content.substring(jsonStart, jsonEnd);
      return JSON.parse(jsonString);
    }
    return content;
  } catch (e) {
    console.error("Ошибка парсинга JSON:", e);
    return content;
  }
}

module.exports = { parseGptResponse };
