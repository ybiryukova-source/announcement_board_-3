# Домашня робота №5

Це простий REST API для дошки оголошень з автентифікацією, роллю власника, захистом маршрутів, логуванням та можливістю додавання фото.

## Технології

- Node.js + Express
- Prisma ORM (SQLite)
- JWT (access + refresh токени)
- bcrypt (хешування паролів)
- celebrate / joi (валідація)
- swagger (документація API)
- helmet / cors / express-rate-limit (безпека)
- pino / pino-http (логування)
- multer / cloudinary (робота з фото)

## Структура проєкту

`prisma/schema.prisma` — база даних (User, Announcement з imageUrl, RefreshToken)
`src/logger.js` — ініціалізація логера pino
`src/config/cloudinary.js` — налаштування Cloudinary
`src/middleware/upload.middleware.js` — тимчасове збереження файлів через multer
`src/middleware/auth.middleware.js` — перевірка JWT
`src/controllers` — логіка API та логування подій
`src/routes` — маршрути (auth + announcements з підтримкою multipart/form-data)
`src/validators` — валідація запитів
`requests.http` — приклади запитів для тестування (включаючи тест Rate Limit та завантаження фото)

## Оголошення

GET /announcements
Публічний список оголошень

GET /announcements/:id
Отримання одного оголошення

POST /announcements 
Створення оголошення (з прив’язкою до userId та опціональним фото)

PATCH /announcements/:id 
Редагування тільки своїх оголошень та оновлення фото

DELETE /announcements/:id 
Видалення тільки своїх оголошень

## Захист

- JWT перевіряється в middleware, без токена доступ до POST / PATCH / DELETE заборонений
- Helmet встановлює безпечні HTTP-заголовки для всіх маршрутів
- CORS дозволяє запити лише з джерел, зазначених в ALLOWED_ORIGINS
- Rate Limiter обмежує кількість запитів до auth-маршрутів (не більше 10 запитів за 15 хвилин)

## Запуск проєкту

npm install
npx prisma migrate dev
npm run dev