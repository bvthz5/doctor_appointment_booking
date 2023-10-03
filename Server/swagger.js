const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express(); // Create an instance of the Express app

// Define the options for swagger-jsdoc
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Doctor Appointment Booking API', // Customize the title
      version: '1.0.0',
      description: 'Swagger UI', // Customize the description
      contact: {
        name: 'Me', 
        email: 'binilvincent80@gmail.com', 
      },
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
    security: [{ bearerAuth: [] }], // Require JWT authentication for all endpoints
    servers: [
      {
        url: 'http://localhost:5000', // Replace with your server URL
      },
    ],
  },
  apis: ['./Routes/*.js'], // Point to the folder containing all your route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve the Swagger UI at /swagger-ui
app.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customSiteTitle: 'Appointment Booking'
}));

module.exports = app; // Export the app instance
