require("dotenv").config();
require("./db");

const express = require("express");
const helmet = require("helmet"); // ⬅️ AÑADIDO

const app = express();

// 👉 Agregar Helmet para configurar cabeceras seguras
app.use(helmet());

// 👉 (Opcional) Personaliza Content-Security-Policy si usas scripts/estilos externos
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https:"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  })
);

require("./config")(app);
require("./routes")(app);
require("./error-handling")(app);

module.exports = app;
