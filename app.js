import express from 'express';
import { errors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';     
import swaggerJSDoc from 'swagger-jsdoc';      
import cookieParser from 'cookie-parser'; 
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';

import logger from './src/logger.js';
import announcementsRouter from './src/routes/announcements.routes.js';
import authRouter from './src/routes/auth.routes.js'; 

const app = express();
const PORT = 3000;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Announcement API',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], 
});

app.use(helmet({ contentSecurityPolicy: false }));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(pinoHttp({ logger }));

app.use(express.json());
app.use(cookieParser()); 
app.use(express.static('public'));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 10, 
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later' }
});

app.use('/auth', authLimiter, authRouter); 

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/announcements', announcementsRouter);

app.use(errors());

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  });
});

app.use((err, req, res, next) => {
  req.log.error(err); 
  res.status(500).json({
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  logger.info(`Server running: http://localhost:${PORT}`);
  logger.info(`Swagger docs available at: http://localhost:${PORT}/api-docs`);
});