const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Validate env props before setting up the server
require("./envValidators")();

const app = express();
const authPublic = require("./routes/auth-public");
const authPrivate = require("./routes/auth-private");
const accounts = require("./routes/accounts");
const loans = require("./routes/loans");
const applications = require("./routes/applications");

const tenantMiddleware = require("./middlewares/tenant");
const jwtMiddleware = require("./middlewares/jwt");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express API for JSONPlaceholder",
    version: "1.0.0",
    description:
      "This is a simple CRUD API application made with Express and documented with Swagger",
  },
  servers: [
    {
      url: process.env.url_web_origin,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      apiKey: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
  },
  security: [{ apiKey: [] }],
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

app.get("/api/health/liveness", (req, res, next) => {
  res.status(200).json({ uptime: process.uptime(), app: "api" });
});

app.get("/api/health/readiness", (req, res, next) => {
  res.sendStatus(200);
});

app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const whitelist = [].concat(
  "http://localhost:4201",
  "http://localhost:4202",
  process.env.url_backoffice_origin.split(","),
  process.env.url_web_origin.split(",")
);

const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api", authPublic);
app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

app.use("/", jwtMiddleware);

// Tenant info decipher and user permission validation
app.use("/", tenantMiddleware);

app.use("/api", authPrivate);
app.use("/api", accounts);
app.use("/api", loans);
app.use("/api", applications);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

module.exports = app;
