const logger = require("../../logger");

function handle404(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  logger.info(`404 Not Found - ${req.method} ${req.url}`);
  next(err);
}

function handleGenericError(err, req, res, next) {
  const statusCode = err.status || 500;
  res.status(statusCode);
  logger.error(
    `Error (${statusCode}) - ${err.message || "Internal Server Error"}`
  );
  res.json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
}

function handleDuplicateErrors(err, req, res, next) {
  if (err.errors && Array.isArray(err.errors)) {
    const uniqueErrors = {};

    err.errors.forEach((error) => {
      const errorKey = `${error.path}-${error.location}`;
      if (!uniqueErrors[errorKey]) {
        uniqueErrors[errorKey] = error;
      }
    });

    err.errors = Object.values(uniqueErrors);
  }
  logger.error(`Duplicate Errors: ${err.message || "Unknown error"}`);
  next(err);
}

const logIncomingRequest = (req, res, next) => {
  console.log(`Incoming request URL: ${req.url}`);
  next(); // Move to the next middleware or route handler
};

// Middleware to handle uncaught exceptions
const handleUncaughtExceptions = () => {
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1); // Exit with failure status code
  });
};

// Middleware to handle unhandled promise rejections
const handleUnhandledRejections = () => {
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    console.error('Promise:', promise);
  });
};


function createCustomError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}









module.exports = {
  handle404,
  handleGenericError,
  handleDuplicateErrors,
  createCustomError,
  // formatError,
  logIncomingRequest,
  handleUncaughtExceptions,
  handleUnhandledRejections
};
