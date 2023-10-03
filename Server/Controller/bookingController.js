const { tryCatch } = require("../Middleware/Errors/tryCatch");
const bookingService = require("../Service/bookingService");
const doctorService = require("../Service/doctorService");
const timeSlotService = require("../Service/timeSlotService");
const tokenGeneration = require("../Util/auth");
const {
  USER_ROLES,
  PACKAGE_STATUS,
  BOOKING_STATUS,
} = require("../Util/constants");

const {
  sendOTPVerificationEmail,
  sendBookingRejectedEmail,
  sendBookingAcceptedEmail,
  sendCancelledBookingEmail,
} = require("../Util/mail");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const { validationResult } = require("express-validator");
const { getHospitalByAdminId } = require("../Service/hospitalService");

/**
 * Adds a new user using the booking service.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the user data and user's email.
 * @param {Object} res - The response object to send success or error responses.
 * @returns {void}
 */
const addUser = async (req, res) => {
  try {
    await bookingService.userAdd(req.body, req.user.email);
    res.status(201).send({ message: "User added successfully" });
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);

    res
      .status(500)
      .send({ errorCode: 1905, message: "An unexpected error occurred" });
  }
};

/**
 * Verifies an OTP against a user's email and provides access token and user details upon success.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the user's email and OTP.
 * @param {Object} res - The response object to send the access token and user details.
 * @param {function} next - The next function to call in the middleware chain.
 * @returns {void}
 */
const verifyOtp = async (req, res, next) => {
  try {
    //check if user exists
    await bookingService.getUserByEmail(req.body.email);
    //check otp matches with email
    const otpValid = await bookingService.getOtpEmail(
      req.body.email,
      req.body.otp
    );

    const { accessTokenSign } = await tokenGeneration.generateTokenValues(
      otpValid.dataValues,
      "USER"
    );

    if (!otpValid.dataValues.firstName) {
      res.send({ accessToken: accessTokenSign, userDetails: { status: 0 } });
    } else {
      otpValid.dataValues.status = 1;
      res.send({
        accessToken: accessTokenSign,
        userDetails: otpValid.dataValues,
      });
    }
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Adds a booking after performing various checks to ensure booking validity.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing booking details.
 * @param {Object} res - The response object to send success or error responses.
 * @param {function} next - The next function to call in the middleware chain.
 * @returns {void}
 */
const addBook = async (req, res, next) => {
  try {
    //check if a doctor exists with this id
    await doctorService.getById(req.body.doctorId);

    //check if a time slots exists with that id
    await timeSlotService.getById(req.body.slot);

    //check the selected slot is in future time
    await bookingService.checkSlotTime(req.body.slot, req.body.date);
    //check doctor is available or not
    await bookingService.doctorAvailable(req);

    const data = {
      doctorId: req.body.doctorId,
      date: req.body.date,
      timeslotId: req.body.slot,
      price: req.body.amount,
      status: 1,
      userId: req.user.id,
    };
    await bookingService.addBooking(data);
    res.send({ message: "Booking successful" });
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Retrieves a list of patients with pagination.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing pagination details.
 * @param {Object} res - The response object to send the patient list or error response.
 * @returns {void}
 */
const patientList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;

    const { items, count } = await bookingService.getAllPatients(
      req,
      limit,
      page
    );
    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;

    const response = {
      items,
      count,
      hasNext,
      currentPage: page,
      totalPages,
    };
    res.send(response);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    res
      .status(500)
      .send({ errorCode: 1905, message: "An unexpected error occurred" });
  }
};

/**
 * Retrieves the booking history of a user (patient) with pagination.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing user information and pagination details.
 * @param {Object} res - The response object to send the booking history or error response.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
const userHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    let doctorHospitalId;

    //check if the patient exists or not
    const patient = await bookingService.getPatient(req.params.userId);

    const doctorIds = patient.map((patient) => patient.doctorId);
    const uniqueDoctorIds = [...new Set(doctorIds)];

    //check the userId passed and logged in userId is equal or doctor is related with the userId that passed
    if (
      (req.user.id != req.params.userId &&
        req?.user?.role === USER_ROLES.USER) ||
      (req.user.role === USER_ROLES.DOCTOR &&
        !uniqueDoctorIds.includes(req.user.id))
    ) {
      return res.status(403).send({
        errorCode: 1903,
        message: "Current user doesn’t have permission to perform this action",
      });
    }

    //get the hospital id of the user if the logged in user is a doctor
    if (req.user.role === USER_ROLES.DOCTOR) {
      doctorHospitalId = await bookingService.getHospitalId(req.user.id);
    }

    const { items, count } = await bookingService.getHistory(
      req.params.userId,
      limit,
      page,
      doctorHospitalId
    );

    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;

    const response = {
      items,
      count,
      hasNext,
      currentPage: page,
      totalPages,
    };
    res.send(response);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Adds or updates user email and OTP information in the database and sends OTP verification email.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing user email.
 * @param {Object} res - The response object to send success or error response.
 * @returns {void}
 */
const addEmail = async (req, res) => {
  try {
    //generate otp for user
    const otp = Math.floor(100000 + Math.random() * 900000);
    let data = {};
    const user = await bookingService.getUser(req.body.email);
    data.otp = otp;
    const expiry = new Date(Date.now() + process.env.OTP_VALIDITY * 60 * 1000);
    data.validity = expiry;

    //if user doesn't exists,add email,otp,validity to db
    if (!user) {
      data.email = req.body.email;
      await bookingService.emailAdd(data);
    } else {
      //if user already exists,change the otp and validity to new one
      await bookingService.updateOtp(data, req.body.email);
    }

    try {
      sendOTPVerificationEmail(req.body.email, otp, "OTP Verification");
      res.status(201).send({ message: "OTP has been sent successfully" });
    } catch (emailError) {
      logger.error(`Error occurred: ${emailError}`);
      res
        .status(500)
        .send({ errorCode: 1905, message: "Email sending failed" });
    }
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    res
      .status(500)
      .send({ errorCode: 1905, message: "An unexpected error occurred" });
  }
};

/**
 * Updates a booking's information in the database.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the booking ID and updated data.
 * @param {Object} res - The response object to send success or error response.
 * @param {Function} next - The next function to call if an error occurs.
 * @returns {void}
 */
const updateBooking = async (req, res, next) => {
  try {
    await bookingService.getById(req.params.bookingId, req.user.id);

    //check if a doctor exists with this id
    await doctorService.getById(req.body.doctorId);

    //check if a time slots exists with that id
    await timeSlotService.getById(req.body.slot);

    //check slot is in future time
    await bookingService.checkSlotTime(req.body.slot, req.body.date);
    //check doctor is available or not
    await bookingService.doctorAvailable(req);

    const data = {
      doctorId: req.body.doctorId,
      date: req.body.date,
      timeslotId: req.body.slot,
      status: 1,
    };

    await bookingService.updateBooking(req.params.bookingId, data);
    res.send({ message: "Successfully updated" });
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);

    next(err);
  }
};

/**
 * Retrieves booking details by extracting booking ID from the request.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the booking ID.
 * @param {Object} res - The response object to send the retrieved booking details.
 * @param {Function} next - The next function to call if an error occurs.
 * @returns {void}
 */
const getBookingById = async (req, res, next) => {
  try {
    const bookingId = await bookingService.getBookingDetails(req);
    res.send(bookingId);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);

    next(err);
  }
};

/**
 * Retrieves available time slots for a given doctor and date.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the doctor ID and date.
 * @param {Object} res - The response object to send the retrieved time slots.
 * @param {Function} next - The next function to call if an error occurs.
 * @returns {void}
 */
const getTimeSlots = async (req, res, next) => {
  try {
    //check if the doctor isd exists
    await doctorService.getById(req.query.doctorId);
    const timeSlots = await bookingService.getAvailableTimeSlots(
      req.query.doctorId,
      req.query.date
    );
    res.send(timeSlots);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);

    next(err);
  }
};

/**
 * Cancels a booking based on the provided booking ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the booking ID.
 * @param {Object} res - The response object to send the cancellation status message.
 * @param {Function} next - The next function to call if an error occurs.
 * @returns {void}
 */
const cancelBooking = async (req, res, next) => {
  try {
    await bookingService.getById(req.params.bookingId, req.user.id);
    await bookingService.cancelBooking(req.params.bookingId);
    res.send({ message: "Appointment cancelled successfully" });
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);

    next(err);
  }
};

/**
 * Retrieves a list of bookings associated with a doctor.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object to send the booking list.
 * @returns {void}
 */
const doctorBookingList = tryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation error: ${errors.errors[0].msg}`);
    return res.status(400).send(errors.errors[0].msg);
  }

  const doctorId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const orderBy = req.query.orderBy || "desc";
  const search = req.query.search || null;
  const type = parseInt(req.query.type) || 0;

  const result = bookingService.getDoctorBookingList(
    doctorId,
    page,
    perPage,
    orderBy,
    search,
    type
  );

  logger.info(`Booking list retrieved for doctor ID: ${doctorId}`);
  return res.status(200).json(result);
});

/**
 * Accepts or rejects a booking based on the action type.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response indicating the result of the action.
 */
const acceptOrRejectBooking = tryCatch(async (req, res) => {
  const bookingId = req.params.id;
  const doctorId = req.user.id;
  const actionType = req.body.type;

  const booking = await bookingService.findBookingByIdAndDoctor(
    bookingId,
    doctorId
  );

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const currentDateTime = new Date();
  if (booking.date < currentDateTime) {
    return res
      .status(400)
      .json({ message: "Cannot accept or reject past bookings" });
  }

  if (actionType === 0) {
    return await handleRejectBooking(booking, res);
  }

  if (actionType === 1) {
    return await handleAcceptBooking(booking, res);
  }

  return res.status(400).json({ message: "Invalid action type" });
});

/**
 * Handles the rejection of a booking.
 *
 * @function
 * @async
 * @param {Object} booking - The booking object to be rejected.
 * @param {Object} res - The response object to send the response.
 * @returns {Object} - The response indicating the booking rejection status.
 */
const handleRejectBooking = tryCatch(async (booking, res) => {
  if (booking.status != BOOKING_STATUS.PENDING) {
    return res.status(400).json({
      message: "Booking cannot be rejected as it is not in pending status",
    });
  }

  await bookingService.rejectBooking(booking.id);
  const userEmail = booking.user.email;
  const userName = booking.user.firstName + " " + booking.user.lastName;
  const doctorName = booking.doctor.name;
  sendBookingRejectedEmail(userEmail, userName, doctorName);
  return res.status(200).json({ message: "Booking rejected successfully" });
});

/**
 * Handles the acceptance of a booking by updating its status to 'accepted' and sending an email notification to the user.
 *
 * @function
 * @async
 * @param {object} booking - The booking object to be accepted.
 * @param {object} res - Express response object to send the response.
 */
const handleAcceptBooking = tryCatch(async (booking, res) => {
  if (booking.status != BOOKING_STATUS.PENDING) {
    return res.status(400).json({
      message: "Booking cannot be accepted as it is not in pending status",
    });
  }

  await bookingService.acceptBooking(booking?.id);
  const userEmail = booking?.user.email;
  const userName = booking?.user.firstName + " " + booking?.user.lastName;
  const bookingDate = booking?.date.toISOString().split("T")[0];
  const bookingTime = booking?.timeslot.dataValues.timeSlot;
  const doctorName = booking?.doctor.name;
  const hospitalName = booking && booking.doctor ? booking.doctor.name : "";

  sendBookingAcceptedEmail(
    userEmail,
    userName,
    bookingDate,
    bookingTime,
    doctorName,
    hospitalName
  );

  return res.status(200).json({ message: "Booking accepted successfully" });
});

/**
 * Cancels an approved booking by a doctor and sends an email notification to the user.
 *
 * @function
 * @async
 * @param {object} req - Express request object.
 * @param {object} res - Express response object to send the response.
 */
const cancelApprovedBookingByDoctor = tryCatch(async (req, res) => {
  console.log("fghjv");
  const bookingId = req.params.id;
  const doctorId = req.user.id;

  const booking = await bookingService.findBookingByIdAndDoctor(
    bookingId,
    doctorId
  );

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status == BOOKING_STATUS.CANCELED) {
    return res.status(400).json({
      message: "Booking is already in cancelled status",
    });
  }

  if (booking.status != BOOKING_STATUS.ACCEPTED) {
    return res.status(400).json({
      message: "Booking cannot be cancelled",
    });
  }

  await bookingService.cancelBooking(booking.id);
  const userEmail = booking.user.email;
  const userName = booking.user.firstName + " " + booking.user.lastName;
  const doctorName = booking.doctor.name;
  sendCancelledBookingEmail(userEmail, userName, bookingId, doctorName);

  return res.status(200).json({ message: "Booking cancelled successfully" });
});

/**
 * Changes the booking time for an appointment by a doctor.
 *
 * @function
 * @async
 * @param {object} req - Express request object.
 * @param {object} res - Express response object to send the response.
 */
const changeBookingTime = tryCatch(async (req, res) => {
  const bookingId = req.params.id;
  const doctorId = req.user.id;
  const newTime = req.body.newTime;

  const updatedBooking = await bookingService.changeBookingTimeByDoctor(
    bookingId,
    doctorId,
    newTime
  );
  if (!updatedBooking) {
    return res.status(404).json({ message: "Booking not found" });
  }
  return res.status(200).json({ message: "Booking time changed successfully" });
});

/**
 * Retrieves a list of bookings for a specific user.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {function} next - Next function to call in the middleware chain.
 */
const userBookings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const { items, count } = bookingService.userBookingList(
      req.user.id,
      limit,
      page
    );

    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;

    const response = {
      items,
      count,
      hasNext,
      currentPage: page,
      totalPages,
    };
    res.send(response);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);

    res
      .status(500)
      .send({ errorCode: 1905, message: "An unexpected error occurred" });
  }
};

/**
 * Get a list of appointments for administrators based on specified criteria.
 *
 * @async
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
const getAppointmentsByAdmin = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let doctorIds = [];
    let result;

    if (req.user.role === "SUPERADMIN") {
      // For SUPERADMIN, list all bookings
      result = await bookingService.getAllBookings(page, limit, search);
    } else if (req.user.role === "ADMIN") {
      // For ADMIN, list bookings under the admin's hospital
      const hospital = await getHospitalByAdminId(req.user.id);
      if (!hospital) {
        return res.status(400).send("No hospital allocated for admin");
      }
      const doctors = await doctorService.getAllDoctorsByHospitalId(
        hospital.id
      );
      doctorIds = doctors.map((doctor) => doctor.id);

      result = await bookingService.getBookingsByDoctorIds(
        page,
        limit,
        search,
        doctorIds
      );
    }

    const totalPages = Math.ceil(result.count / limit);
    const hasNext = page < totalPages;

    const response = {
      items: result.items,
      count: result.count,
      hasNext,
      currentPage: page,
      totalPages,
    };

    res.status(200).json(response);
    logger.info("Admin controller");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const acceptOrRejectBookingByAdmin = tryCatch(async (req, res) => {
  const bookingId = req.params.id;
  const actionType = req.body.type;

  const booking = await bookingService.findBookingByIdAndDoctor(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  const currentDateTime = new Date();
  console.log(currentDateTime, "dddddddd", booking.date);
  if (booking.date < currentDateTime.getDate) {
    return res
      .status(400)
      .json({ message: "Cannot accept or reject past bookings" });
  }

  if (actionType === 0) {
    return await handleRejectBooking(booking, res);
  }

  if (actionType === 1) {
    return await handleAcceptBooking(booking, res);
  }

  return res.status(400).json({ message: "Invalid action type" });
});

const cancelApprovedBookingByAdmin = tryCatch(async (req, res) => {
  const bookingId = req.params.id;

  const booking = await bookingService.findBookingByIdAndDoctor(bookingId);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found" });
  }

  if (booking.status == BOOKING_STATUS.CANCELED) {
    return res.status(400).json({
      message: "Booking is already in cancelled status",
    });
  }

  if (booking.status != BOOKING_STATUS.ACCEPTED) {
    return res.status(400).json({
      message: "Booking cannot be cancelled",
    });
  }

  await bookingService.cancelBooking(booking.id);
  const userEmail = booking.user.email;
  const userName = booking.user.firstName + " " + booking.user.lastName;
  const doctorName = booking.doctor.name;
  sendCancelledBookingEmail(userEmail, userName, bookingId, doctorName);

  return res.status(200).json({ message: "Booking cancelled successfully" });
});

const changeBookingTimeByAdmin = tryCatch(async (req, res) => {
  const { id: bookingId } = req.params;
  const { newTime } = req.body;
  const { id: userId, role: userRole } = req.user;

  try {
    const updatedBooking = await bookingService.changeBookingTime(
      bookingId,
      newTime,
      userId,
      userRole
    );

    return res
      .status(200)
      .json({
        message: "Booking time changed successfully",
        booking: updatedBooking,
      });
  } catch (error) {
    if (error.statusCode === 404) {
      return res.status(404).json({ message: "Booking not found" });
    }
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = {
  getAppointmentsByAdmin,
  addUser,
  verifyOtp,
  addBook,
  doctorBookingList,
  acceptOrRejectBooking,
  patientList,
  userHistory,
  addEmail,
  userBookings,
  changeBookingTime,
  updateBooking,
  cancelBooking,
  cancelApprovedBookingByDoctor,
  getBookingById,
  getTimeSlots,
  acceptOrRejectBookingByAdmin,
  cancelApprovedBookingByAdmin,
  changeBookingTimeByAdmin,
};
