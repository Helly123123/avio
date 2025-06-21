const pool = require("./db");

class Params {
  static async giveRecommendations(
    name,
    age,
    goal,
    work_type,
    sleep_hours,
    meals,
    energy_level,
    work_start,
    work_end,
    stress_level,
    physical_activity,
    rest_preferences,
    wake_up_time,
    user_question
  ) {
    const params = `Вы — ИИ-помощник, который помогает пользователю максимально оптимизировать продуктивность. Используйте следующие данные пользователя для персонализированных ответов, учитывая его цели и состояние.
Данные пользователя: Имя: ${name} Возраст: ${age} лет Цель использования: ${goal}  Тип работы: ${work_type} Время сна сегодня: ${sleep_hours} часов Приемы пищи сегодня: ${meals} Уровень энергии: ${energy_level}/10 График работы: с ${work_start} до ${work_end} Уровень стресса: ${stress_level}/10  Физическая активность: ${physical_activity} Предпочтения по отдыху: ${rest_preferences} Время пробуждения: ${wake_up_time}  
Вопрос пользователя: ${user_question}
`;
    return params;
  }
}

module.exports = Params;
