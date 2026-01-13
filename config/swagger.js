const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");

function swaggerDocs(app) {
  const swaggerPath = path.join(__dirname, "../docs/swagger.yaml");
  const swaggerDocument = YAML.load(swaggerPath);

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  console.log("📄 Swagger disponível em: http://localhost:3000/api-docs");
}

module.exports = { swaggerDocs };
