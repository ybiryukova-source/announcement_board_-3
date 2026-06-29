import express from 'express';
import { 
  register, 
  login, 
  refresh, 
  logout, 
  me 
} from '../controllers/auth.controller.js';

import { registerValidator, loginValidator } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Реєстрація нового користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *                 example: ivan_petrenko
 *               password:
 *                 type: string
 *                 example: securepass123
 *               name:
 *                 type: string
 *                 example: Іван
 *     responses:
 *       201:
 *         description: Користувача створено
 *       409:
 *         description: Користувач вже існує
 */
router.post('/register', registerValidator, register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Вхід користувача
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: ivan_petrenko
 *               password:
 *                 type: string
 *                 example: securepass123
 *     responses:
 *       200:
 *         description: Успішний вхід
 *       401:
 *         description: Невірні дані
 */
router.post('/login', loginValidator, login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Оновлення токенів
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Токени оновлено
 *       401:
 *         description: Невалідний refresh token
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Вихід з системи
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout success
 */
router.post('/logout', authenticate, logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Профіль користувача
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Дані користувача
 *       401:
 *         description: Unauthorized
 */
router.get('/me', authenticate, me);

export default router;