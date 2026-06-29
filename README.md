Домашня робота №4 — REST API з JWT автентифікацією

Це простий REST API для дошки оголошень з автентифікацією, роллю власника та захистом маршрутів.

Технології

- Node.js + Express
- Prisma ORM (SQLite)
- JWT (access + refresh токени)
- bcrypt (хешування паролів)
- celebrate / joi (валідація)
- swagger (документація API)

 Структура проєкту

`prisma/schema.prisma` — база даних (User, Announcement, RefreshToken)
`src/controllers` — логіка API
`src/routes` — маршрути (auth + announcements)
`src/middleware/auth.middleware.js` — перевірка JWT
`src/validators` — валідація запитів
`requests.http` — приклади запитів для тестування


 Оголошення

GET /announcements
Публічний список оголошень

GET /announcements/:id
Отримання одного оголошення

POST /announcements 
Створення оголошення (з прив’язкою до userId)

PATCH /announcements/:id 
Редагування тільки своїх оголошень

DELETE /announcements/:id 
Видалення тільки своїх оголошень


Захист

JWT перевіряється в middleware
 без токена доступ до POST / PATCH / DELETE заборонений

Запуск проєкту

npm install
npx prisma migrate dev
npm run dev