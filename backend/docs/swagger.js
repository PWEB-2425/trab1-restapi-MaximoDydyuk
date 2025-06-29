// backend/docs/swagger.js
const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"], // Caminho para seus arquivos de rota
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
