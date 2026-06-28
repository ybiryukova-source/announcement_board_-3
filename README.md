Домашня робота 3

RESTful API для сервісу "Дошка оголошень"

Стек
* Node.js / Express 5
* Prisma ORM (SQLite)
* Celebrate / Joi (валідація)
* Swagger (документація)

Структура проєкту
`prisma/schema.prisma` — модель даних та міграції
`src/routes/` — маршрути та Swagger-коментарі
`src/controllers/` — бізнес-логіка 
`src/validators/` — схеми валідації вхідних даних
`requests.http` — файл для тестування 
Ендпоінти
* `GET /announcements` — список із пагінацією сортуванням та пошуком
* `GET /announcements/:id` — повна інформація за ID 
* `POST /announcements` — створення з обов'язковою валідацією полів
* `PATCH /announcements/:id` — часткове оновлення полів (400 на порожній об'єкт)
* `DELETE /announcements/:id` — видалення (статус 204 No Content)

Швидкий запуск

1. Встановити залежності:
npm install

2. Запустити міграції та сервер:

npm run prisma:migrate
npm run dev