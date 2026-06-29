import express from 'express';
import { errors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';     
import swaggerJSDoc from 'swagger-jsdoc';      
import cookieParser from 'cookie-parser'; 
import announcementsRouter from './src/routes/announcements.routes.js';
import authRouter from './src/routes/auth.routes.js'; // <-- Додали імпорт auth роутера

const app = express();
const PORT = 3000;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Announcement API',
      version: '1.0.0',
    },
    // Додаємо securitySchemes, щоб Swagger підтримував Bearer токени
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

app.use(express.json());
app.use(cookieParser()); 
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/announcements', announcementsRouter);
app.use('/auth', authRouter); // <-- Підключили маршрути автентифікації

app.use(errors());

app.use((req, res) => {
  res.status(404).json({
    error: 'Not found'
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
  console.log(`Swagger docs available at: http://localhost:${PORT}/api-docs`);
});