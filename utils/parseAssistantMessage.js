function parseAssistantMessage(assistantMessage) {
  if (!assistantMessage) {
    throw new Error("Assistant message is empty");
  }

  let parsedData;
  try {
    parsedData = JSON.parse(assistantMessage);
  } catch (parseError) {
    console.error("Ошибка парсинга JSON:", parseError);
    throw new Error("Invalid JSON format in message");
  }

  return parsedData.recommendations || [];
}

module.exports = { parseAssistantMessage };
