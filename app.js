import express from 'express';
import { errors } from 'celebrate';
import swaggerUi from 'swagger-ui-express';     
import swaggerJSDoc from 'swagger-jsdoc';      
import announcementsRouter from './src/routes/announcements.routes.js';

const app = express();
const PORT = 3000;

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Announcement API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.js'], 
});

app.use(express.json());
app.use(express.static('public'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/announcements', announcementsRouter);

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