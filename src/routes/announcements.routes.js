import express from 'express';

import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from '../controllers/announcements.controller.js';

import {
  getAnnouncementsValidator,
  getAnnouncementByIdValidator,
  createAnnouncementValidator,
  updateAnnouncementValidator,
  deleteAnnouncementValidator,
} from '../validators/announcements.validator.js';

const router = express.Router();

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Отримати список оголошень
 *     description: Повертає список оголошень з пошуком, сортуванням та пагінацією.
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Пошук за назвою
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum:
 *             - newest
 *             - oldest
 *         description: Сортування
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Номер сторінки
 *     responses:
 *       200:
 *         description: Список оголошень успішно отримано
 *       400:
 *         description: Некоректні параметри запиту
 */
router.get(
  '/',
  getAnnouncementsValidator,
  getAnnouncements
);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Отримати оголошення за ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Оголошення знайдено
 *       404:
 *         description: Announcement not found
 */
router.get(
  '/:id',
  getAnnouncementByIdValidator,
  getAnnouncementById
);

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Створити нове оголошення
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - price
 *               - category
 *               - contactInfo
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum:
 *                   - sale
 *                   - service
 *                   - job
 *                   - other
 *               contactInfo:
 *                 type: string
 *     responses:
 *       201:
 *         description: Оголошення створено
 *       400:
 *         description: Помилка валідації
 */
router.post(
  '/',
  createAnnouncementValidator,
  createAnnouncement
);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Частково оновити оголошення
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *                 enum:
 *                   - sale
 *                   - service
 *                   - job
 *                   - other
 *               contactInfo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Оголошення оновлено
 *       400:
 *         description: Помилка валідації
 *       404:
 *         description: Announcement not found
 */
router.patch(
  '/:id',
  updateAnnouncementValidator,
  updateAnnouncement
);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Видалити оголошення
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Оголошення успішно видалено
 *       404:
 *         description: Announcement not found
 */
router.delete(
  '/:id',
  deleteAnnouncementValidator,
  deleteAnnouncement
);

export default router;