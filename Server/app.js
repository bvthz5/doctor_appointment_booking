const express = require("express");
const app = express();

const bookingRoutes = require("./Routes/bookingRoutes");
const leaveRoutes = require("./Routes/leaveRoutes");
const logger = require("./logger");
const blogRoutes = require("./Routes/blogRoutes");
const errorHandler = require("./Middleware/Errors/errorHandler");
const errorMessage = require("./Middleware/Errors/errorMessages")
const doctorRoutes = require("./Routes/doctorRoutes");
const usersRoutes = require("./Routes/userRoutes");

const loginRoutes = require("./Routes/loginRoutes");
const userRoutes = require("./Routes/hospitalRoutes");
const serviceRoutes = require("./Routes/serviceRoutes");
const specialtyRoutes = require("./Routes/specialtyRoutes");
const subSpecialtyRoutes = require("./Routes/subSpecialtyRoutes");
const facilityRoutes = require("./Routes/facilityRoutes");
const adminRoutes = require("./Routes/adminRoutes");
const packageRoutes = require("./Routes/packageRoutes")
const timeSlotRoutes = require("./Routes/timeSlot")
const swaggerUi = require("./swagger");
const helmet = require("helmet");
const expressSanitizer = require("express-sanitizer");
const {logIncomingRequest} = require("./Middleware/Errors/errorHandler")
const cors = require("cors");
const PORT = process.env.PORT || 5000;



// Middleware to parse JSON request bodies
app.use(express.json());

app.use(cors());

// Use the helmet middleware to enhance security by setting HTTP headers
app.use(helmet());

// Use the express-sanitizer middleware for input sanitization
app.use(expressSanitizer());

// Use the custom middleware for logging incoming requests
app.use(logIncomingRequest);

// Custom middleware to handle URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Route for api

app.use('/booking',bookingRoutes)
app.use('/package',packageRoutes)
app.use("/doctor", leaveRoutes);
app.use("/blog", blogRoutes);
app.use("/doctors", doctorRoutes);
app.use("/users", loginRoutes);
app.use("/hospitals", userRoutes);
app.use("/service", serviceRoutes);
app.use("/specialty", specialtyRoutes);
app.use("/subspecialty", subSpecialtyRoutes);
app.use("/facility", facilityRoutes);
app.use("/admin", adminRoutes);
app.use("/user", usersRoutes);
app.use("/timeSlots",timeSlotRoutes)


app.use("/", swaggerUi);

// Error handling middleware
app.use(errorMessage.formatError);
app.use(errorHandler.handle404);
app.use(errorHandler.handleGenericError);
app.use(errorHandler.handleDuplicateErrors);
app.use(errorHandler.handleUncaughtExceptions);
app.use(errorHandler.handleUnhandledRejections)


app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
