const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const app = express();

// Global Middlewares

// Set Security HTTP headers
app.use(helmet());

// CORS // Access-Control-Allow-Origin * (all users)

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,PATCH,POST,DELETE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
  );
  next();
});

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.options("*", cors());

// Development logging
if (process.env.NODE_ENV === "development") {
  // 3rd party middleware
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

// Middlewares
app.use("/api", limiter);

// Data sanitization NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Body parser, reading data from from body into req.body
app.use(express.json());

// Importing Error Handlers
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

// Importing Routes
const userRouter = require("./routes/userRoutes");
const blogRouter = require("./routes/blogRoutes");

const blogfileRouter = require("./routes/blogfileRoutes");

// Mounting Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/blogs", blogRouter);

app.use("/api/v1/blogsfile", blogfileRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Blog App",
  });
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = app;
