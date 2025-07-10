
## AVIO API

#### Создание пользователя

```http
  POST /api/register
```

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `password` | `string` | Да |
| `email` | `string` | Да |
| `age` | `Int` | Нет |
| `typeWork` | `string` | Нет |
| `purpose` | `string` | Нет |

#### Ответ 201

```javascript
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cC...",
    "user": {
        "email": "pizda@mail.ru",
        "login": "helly"
    }
}
```

#### Авторизация
       
```http
  POST /api/login
```    

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `email` | `string` | Да |

#### Ответ 201

```javascript
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cC...",
    "user": {
        "email": "pizda@mail.ru",
        "login": "helly"
    }
}
```

#### Изменение/создание ежедневных данных пользователя
       
```http
  POST /api/changeUserDaily
```    

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `sleep_time` | `string` | Да |
| `meals` | `Object` | Да |
| `energy_level` | `Int` | Да |
| `work_schedule: { start: "09:00" end: "18:00" }` | `Object` | Да |
| `stress_level` | `Int` | Да |
| `physical_activity` | `string` | Да |
| `recreation_preferences` | `Object` | Да |
| `time_awakening` | `string` | Да |

#### Ответ 200

```javascript
{
    "message": "Данные пользователя успешно обновлены",
    "login": "helly"
}
```

#### Получить задачи
       
```http
  GET /api/getTasks
```    

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `created_at` | `string` | Да |

#### Ответ 200

```javascript
{
    "data": [
        {
            "uuid": "2d51059e-9e27-482d-b8b7-f46caf870989",
            "text": "Провести короткую медитацию для повышения концентрации и снижения стресса.",
            "status": 0,
            "time": "09:30",
            "created_at": "2025-07-09T22:00:00.000Z"
        },
    ]
}
```

#### Изменить статус задачи
       
```http
  POST /api/updateStatusTasks
```    

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `status` | `0 или 1` | Да |
| `uuid` | `string` | Да |

#### Ответ 200

```javascript
{
    "data": true
}
```

#### Изменить статус рассылки
       
```http
  POST /api/changeMailingStation
```    

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `value` | `0 или 1` | Да |
| `user_id` | `string` | Да |

#### Ответ 200

```javascript
{
    "is_active": 1 // или 0
}
```

#### Получить рекомендации 

```http
  POST /api/giveRecommendations
```    

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `day` | `string` | Да |

#### Ответ 200

```javascript
{
    "data": {
        "request_id": 18163569,
        "model": "gpt-4-1",
        "status": "processing"
    },
    "user": {
        "uuid": "90e38f8d-1e06-4b7e-801b-9edf24034e70",
        "login": "helly",
        "password": "$2b$10$NX38SF9d5aTFs4nRRYsnf.HGOz8zciY0G9m/ihfbMwGzjYopGIAD.",
        "email": "pizda@mail.ru",
        "age": 16,
        "purpose": "popoa",
        "typeWork": "gbpl",
        "created_at": "2025-07-10T19:24:57.000Z",
        "sleep_time": 8,
        "meals": [
            "breakfast",
            "lunch",
            "dinner"
        ],
        "energy_level": 7,
        "work_schedule": {
            "start": "09:00",
            "end": "18:00"
        },
        "stress_level": 5,
        "physical_activity": 7,
        "recreation_preferences": [
            "walk",
            "meditation"
        ],
        "time_awakening": "07:30",
        "has_daily_data": true
    },
    "logs": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    }
}
```

#### Получить задачи 

```http
  POST /api/createTasks
```    

| Параметр | Тип данных     |  Обязательное               |
| :-------- | :------- |  :------------------------- |
| `login` | `string` | Да |
| `day` | `string` | Да |

#### Ответ 200

```javascript
{
    "data": {
        "request_id": 18163569,
        "model": "gpt-4-1",
        "status": "processing"
    },
    "user": {
        "uuid": "90e38f8d-1e06-4b7e-801b-9edf24034e70",
        "login": "helly",
        "password": "$2b$10$NX38SF9d5aTFs4nRRYsnf.HGOz8zciY0G9m/ihfbMwGzjYopGIAD.",
        "email": "pizda@mail.ru",
        "age": 16,
        "purpose": "popoa",
        "typeWork": "gbpl",
        "created_at": "2025-07-10T19:24:57.000Z",
        "sleep_time": 8,
        "meals": [
            "breakfast",
            "lunch",
            "dinner"
        ],
        "energy_level": 7,
        "work_schedule": {
            "start": "09:00",
            "end": "18:00"
        },
        "stress_level": 5,
        "physical_activity": 7,
        "recreation_preferences": [
            "walk",
            "meditation"
        ],
        "time_awakening": "07:30",
        "has_daily_data": true
    },
    "logs": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 0,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    }
}
```

![App Screenshot](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHvTyIyWtlXugChDiJfZ8KLcnbmuBUeAVXWg&s)

