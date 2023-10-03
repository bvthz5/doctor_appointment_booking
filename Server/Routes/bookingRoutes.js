const express = require("express");
const router = express.Router();
const bookingController = require("../Controller/bookingController");
const { userValidator } = require("../Middleware/Validator/userValidator");
const {
  validateData,
  validateContentType,
} = require("../Middleware/Errors/error");
const {
  authenticateTokenUser,
  authenticateTokenDoctor,
  authenticateTokenUserDoctor,
  adminOrSuperAdminAuthenticateToken,
} = require("../Util/auth");
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const {
  bookingValidator,
} = require("../Middleware/Validator/bookingValidator");
const allowedContentTypes = ["application/json"];

router
  .put(
    "/addUser",
    authenticateTokenUser,
    validateContentType(allowedContentTypes),
    userValidator("addUser"),
    validateData,
    bookingController.addUser
  )
  .put(
    "/otpVerification",
    validateContentType(allowedContentTypes),
    userValidator("otpVerification"),
    validateData,
    bookingController.verifyOtp
  )
  .post(
    "/addBooking",
    authenticateTokenUser,
    validateContentType(allowedContentTypes),
    userValidator("addBooking"),
    validateData,
    bookingController.addBook
  )
  .put(
    "/update/:bookingId",
    authenticateTokenUser,
    validateContentType(allowedContentTypes),
    userValidator("updateBooking"),
    validateData,
    bookingController.updateBooking
  )
  .put(
    "/cancel/:bookingId",
    authenticateTokenUser,
    bookingController.cancelBooking
  )
  .get(
    "/patient",
    authenticateTokenDoctor,
    userValidator("paginationHandler"),
    validateData,
    bookingController.patientList
  )
  .get(
    "/history/:userId",
    authenticateTokenUserDoctor,
    userValidator("paginationHandler"),
    validateData,
    bookingController.userHistory
  )
  .post(
    "/addEmail",
    validateContentType(allowedContentTypes),
    userValidator("addEmail"),
    validateData,
    bookingController.addEmail
  )
  .get(
    "/view/:id",
    authenticateTokenDoctor,
    bookingValidator("viewBooking"),
    userValidator("paginationHandler"),
    validateIdMiddleware,
    bookingController.doctorBookingList
  )

  .put(
    "/confirmation/:id",
    authenticateTokenDoctor,
    validateContentType(allowedContentTypes),
    validateIdMiddleware,
    validateData,
    bookingController.acceptOrRejectBooking
  )
  .put(
    "/cancel/:id",
    authenticateTokenDoctor,
    validateIdMiddleware,
    validateData,
    bookingController.cancelApprovedBookingByDoctor
  )
  .put(
    "/changeTime/:id",
    authenticateTokenDoctor,
    validateContentType(allowedContentTypes),
    validateIdMiddleware,
    validateData,
    bookingController.changeBookingTime
  )

  .get(
    "/userBookings",
    authenticateTokenUser,
    userValidator("paginationHandler"),
    validateData,
    bookingController.userBookings
  )
  .get(
    "/viewById/:id",
    authenticateTokenUserDoctor,
    bookingController.getBookingById
  )
  .get(
    "/doctor",
    authenticateTokenUserDoctor,
    userValidator("availableSlots"),
    validateData,
    bookingController.getTimeSlots
  )

  .get(
    "/admin/appointments/all",
    adminOrSuperAdminAuthenticateToken,
    bookingController.getAppointmentsByAdmin
  )
  .put(
    "/admin/confirmation/:id",
    adminOrSuperAdminAuthenticateToken,
    validateContentType(allowedContentTypes),
    validateIdMiddleware,
    validateData,
    bookingController.acceptOrRejectBookingByAdmin
  )
  .put(
    "/admin/cancelBooking/:id",
    adminOrSuperAdminAuthenticateToken,
    validateIdMiddleware,
    validateData,
    bookingController.cancelApprovedBookingByAdmin
  )

  .put(
    "/admin/changeBookingTime/:id",
    adminOrSuperAdminAuthenticateToken,
    validateContentType(allowedContentTypes),
    validateIdMiddleware,
    validateData,
    bookingController.changeBookingTimeByAdmin
  );

module.exports = router;
