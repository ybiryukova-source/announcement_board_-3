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

import { authenticate } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /announcements:
 *   get:
 *     summary: Отримати список оголошень
 *     tags: [Announcements]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [newest, oldest]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Список оголошень
 */
router.get('/', getAnnouncementsValidator, getAnnouncements);

/**
 * @swagger
 * /announcements/{id}:
 *   get:
 *     summary: Отримати оголошення по ID
 *     tags: [Announcements]
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
 *         description: Not found
 */
router.get('/:id', getAnnouncementByIdValidator, getAnnouncementById);

/**
 * @swagger
 * /announcements:
 *   post:
 *     summary: Створити оголошення (з можливістю завантаження фото)
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Створено
 *       400:
 *         description: Помилка валідації
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/',
  authenticate,
  upload.single('image'),
  createAnnouncementValidator,
  createAnnouncement
);

/**
 * @swagger
 * /announcements/{id}:
 *   patch:
 *     summary: Оновити оголошення
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
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
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Оновлено
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.patch(
  '/:id',
  authenticate,
  upload.single('image'),
  updateAnnouncementValidator,
  updateAnnouncement
);

/**
 * @swagger
 * /announcements/{id}:
 *   delete:
 *     summary: Видалити оголошення
 *     tags: [Announcements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Видалено
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Not found
 */
router.delete(
  '/:id',
  authenticate,
  deleteAnnouncementValidator,
  deleteAnnouncement
);

export default router;