// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Delicious Food API',
      version: '1.0.0',
      description: 'Restaurant management and food ordering platform',
    },
    servers: [
      { url: 'http://localhost:5000/api/v1', description: 'Dev' },
    ],
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
  // ← where to look for JSDoc comments
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);