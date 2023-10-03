const User = require("../Model/userModel");
const Booking = require("../Model/bookingModel");
const Leave = require("../Model/leaveModel");
const TimeSlot = require("../Model/timeSlotModel");
const { Op, literal } = require("sequelize");
const Doctor = require("../Model/doctorModel");
const History = require("../Model/history");
const nodemailer = require("nodemailer");
const Hospital = require("../Model/hospitalModel");
const Specialty = require("../Model/specialtyModel");
const { sendBookingTimeChangedEmail } = require("../Util/mail");
const { createCustomError } = require("../Middleware/Errors/errorHandler");
const sequelize = require("../database");
const {
  USER_ROLES,
  COMMON_STATUS,
  BOOKING_STATUS,
} = require("../Util/constants");
const Blog = require("../Model/blogModel");

/**
 * Updates user data based on the provided email address.
 *
 * @function
 * @async
 * @param {Object} data - The updated user data.
 * @param {string} email - The email address of the user to update.
 * @returns {Promise<void>} - A Promise that resolves when the user's data is updated.
 */
const userAdd = async (data, email) => {
  await User.update(data, { where: { email: email } });
};

/**
 * Retrieves a user based on the provided email address.
 *
 * @function
 * @async
 * @param {string} email - The email address of the user to retrieve.
 * @returns {Promise<Object>} - A Promise that resolves to the retrieved user object.
 * @throws {CustomError} - Throws a custom error if the user is not found.
 */
const getUserByEmail = async (email) => {
  const getUser = await User.findOne({ where: { email: email } });
  if (!getUser) {
    // Create custom error
    const error = createCustomError("User not found", 400);
    throw error;
  }
  return getUser;
};

/**
 * Verifies OTP against a user's email and OTP, ensuring validity and raising errors if necessary.
 *
 * @function
 * @async
 * @param {string} email - The email address of the user for OTP verification.
 * @param {string} otp - The One-Time Password for verification.
 * @returns {Promise<Object>} - A Promise that resolves to the user object if verification is successful.
 * @throws {CustomError} - Throws a custom error for OTP verification failure or expired validity.
 */
const getOtpEmail = async (email, otp) => {
  const userVerify = await User.findOne({ where: { email: email, otp: otp } });
  if (!userVerify) {
    // Create custom error
    const error = createCustomError(
      "OTP verification failed! Incorrect OTP",
      400
    );
    throw error;
  } else if (userVerify.dataValues.validity < Date.now()) {
    // Create custom error
    const error = createCustomError(
      "OTP verification failed! OTP validity expired",
      400
    );
    throw error;
  } else {
    return userVerify;
  }
};

/**
 * Creates a new booking record using the provided data.
 *
 * @function
 * @async
 * @param {Object} data - The data for the new booking.
 * @returns {Promise<void>} - A Promise that resolves when the booking is created.
 */
const addBooking = async (data) => {
  await Booking.create(data);
};

const userExists = async (email) => {
  const user = await User.findOne({
    where: {
      email: email,
    },
  });
  return user;
};

/**
 * Checks if a doctor is available for a specific time slot and date, considering existing bookings and leave periods.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing booking details.
 * @returns {Promise<void>} - A Promise that resolves if the doctor is available, or throws an error if not.
 * @throws {CustomError} - Throws a custom error if the doctor is unavailable.
 */
const doctorAvailable = async (req) => {
  const date = new Date(req.body.date);
  let whereClause = {
    doctorId: req.body.doctorId,
    timeslotId: req.body.slot,
    date: date,
    status: {
      [Op.or]: [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED],
    },
  };

  const doctorLeave = await Leave.findAll({
    where: {
      doctorId: req.body.doctorId,
      timeslotId: req.body.slot,
      status: COMMON_STATUS.ACTIVE,
      [Op.or]: {
        startDate: date,
        endDate: date,
      },
    },
  });

  if (req.params.bookingId) {
    whereClause = {
      ...whereClause,
      [Op.not]: {
        id: req.params.bookingId,
      },
    };
  }

  const doctorBookings = await Booking.findAll({
    where: whereClause,
  });

  if (doctorBookings.length != 0 || doctorLeave.length != 0) {
    // Create custom error
    const error = createCustomError("Doctor unavailable", 400);
    throw error;
  }
};

/**
 * Retrieves a list of patients with pagination and calculates the total count of unique patients.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the doctor's information.
 * @param {number} limit - The maximum number of patients to retrieve per page.
 * @param {number} page - The current page number.
 * @returns {Promise<Object>} - A Promise that resolves to the list of patients and total count.
 */
const getAllPatients = async (req, limit, page) => {
  const patient = await Booking.scope("distinctUserId").findAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: { doctorId: req.user.id },
    include: [
      {
        model: User,
        attributes: ["firstName", "lastName", "email", "gender", "dob"],
      },
    ],
  });

  const totalCount = await Booking.count({
    attributes: [
      "userId",
      [sequelize.fn("COUNT", sequelize.col("userId")), "userCount"],
    ],
    where: {
      doctorId: 1,
    },
    group: ["userId"],
  });

  return {
    items: patient,
    count: totalCount.length,
  };
};

/**
 * Retrieves patient history with pagination and additional information from related models.
 *
 * @function
 * @async
 * @param {number} userId - The ID of the patient (user) whose history is being retrieved.
 * @param {number} limit - The maximum number of history items to retrieve per page.
 * @param {number} page - The current page number.
 * @param {number|null} hospitalId - The ID of the hospital (optional) for filtering by hospital.
 * @returns {Promise<Object>} - A Promise that resolves to the patient history items and total count.
 */
const getHistory = async (userId, limit, page, hospitalId) => {
  let doctorIds;
  if (hospitalId) {
    doctorIds = await Doctor.findAll({
      attributes: ["id"],
      include: [
        {
          model: Specialty,
          attributes: ["id"],
        },
        {
          model: Hospital,
          attributes: ["id"],
          where: { id: hospitalId },
        },
      ],
    }).then((doctors) => doctors.map((doctor) => doctor.id));
  }

  const patientHistory = await History.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    // Include additional information from booking table and doctor table
    include: [
      {
        model: Booking,
        where: {
          userId: userId,
          ...(doctorIds && { doctorId: doctorIds }),
        },
        attributes: ["id", "date", "timeslotId", "userId", "doctorId"],
        include: [
          {
            model: Doctor,
            attributes: ["name", "email", "designation"],
            include: [
              {
                model: Specialty,
                attributes: ["id"],
              },
              {
                model: Hospital,
                attributes: ["id", "name"],
              },
            ],
          },
          {
            model: User,
            attributes: [
              "id",
              "firstName",
              "lastName",
              "dob",
              "gender",
              "mobileNo",
            ],
          },
        ],
      },
    ],
    attributes: ["reason", "prescription", "bookingId", "id"],
    order: [["updatedAt", "DESC"]],
  });

  return {
    items: patientHistory.rows,
    count: patientHistory.count,
  };
};

const getUser = async (email) => {
  const getUser = await User.findOne({ where: { email: email } });
  return getUser;
};

/**
 * Adds user email and OTP information to the User table in the database.
 *
 * @function
 * @async
 * @param {Object} data - The data object containing email, OTP, and validity.
 * @returns {Promise<void>} - A Promise that resolves when the user email and OTP information is added to the database.
 */
const emailAdd = async (data) => {
  await User.create(data);
};

/**
 * Updates OTP and validity information for a user in the User table of the database.
 *
 * @function
 * @async
 * @param {Object} data - The data object containing OTP and validity.
 * @param {string} email - The email of the user to update.
 * @returns {Promise<void>} - A Promise that resolves when the OTP and validity information is updated in the database.
 */
const updateOtp = async (data, email) => {
  await User.update(data, { where: { email: email } });
};

/**
 * Retrieves bookings associated with a specific user ID to check if the user is a patient.
 *
 * @function
 * @async
 * @param {number} userId - The ID of the user to check.
 * @returns {Promise<Array>} - A Promise that resolves to an array of bookings associated with the user.
 * @throws {CustomError} - Throws a custom error if the user is not found.
 */
const getPatient = async (userId) => {
  const patient = await Booking.findAll({ where: { userId: userId } });
  if (patient.length == 0) {
    // Create custom error
    const error = createCustomError("Patient not found", 404);
    throw error;
  }
  return patient;
};

/**
 * Retrieves booking information by its ID and performs permission and status checks.
 *
 * @function
 * @async
 * @param {number} bookingId - The ID of the booking to retrieve.
 * @param {number} userId - The ID of the user making the request.
 * @returns {Promise<Object>} - A Promise that resolves to the retrieved booking object if checks pass.
 */
const getById = async (bookingId, userId) => {
  const bookId = await Booking.findByPk(bookingId, {
    include: { model: TimeSlot },
  });
  const bookingDate = bookId.date; // Assuming date is in YYYY-MM-DD format
  const bookingTime = bookId.timeslot.timeSlot; // Assuming timeSlot is in HH:mm:ss format

  // Get current date and time
  const currentDate = new Date();

  // Parse booking date and time strings to create Date objects
  const parsedBookingDateTime = new Date(`${bookingDate} ${bookingTime}`);
  if (!bookId) {
    // Create custom error
    const error = createCustomError("Booking Id not found", 404);
    throw error;
  } else if (userId != bookId.dataValues.userId) {
    // Create custom error
    const error = createCustomError(
      "Current user doesn’t have permission to perform this action",
      403
    );
    throw error;
  } else if (bookId.dataValues.status === BOOKING_STATUS.CANCELED) {
    // Create custom error
    const error = createCustomError(
      "Booking has been already cancelled ! Appointment cannot be cancelled / updated",
      400
    );
    throw error;
  } else if (bookId.dataValues.status === BOOKING_STATUS.REJECTED) {
    // Create custom error
    const error = createCustomError(
      "Booking has been already rejected ! Appointment cannot be cancelled / updated",
      400
    );
    throw error;
  } else if (parsedBookingDateTime < currentDate) {
    const error = createCustomError("Booking date has already passed", 400);
    throw error;
  }

  return bookId;
};

/**
 * Retrieves the hospital ID associated with a specific doctor ID.
 *
 * @function
 * @async
 * @param {number} doctorId - The ID of the doctor.
 * @returns {Promise<number>} - A Promise that resolves to the hospital ID associated with the doctor.
 */
const getHospitalId = async (doctorId) => {
  const hospitalData = await Doctor.findByPk(doctorId);
  const hospitalId = hospitalData.dataValues.hospitalId;
  return hospitalId;
};

const updateBooking = async (bookingId, data) => {
  await Booking.update(data, { where: { id: bookingId } });
};

/**
 * Retrieves a list of doctor bookings based on various filters.
 *
 * @function
 * @async
 * @param {number} doctorId - The ID of the doctor to fetch bookings for.
 * @param {number} page - The current page number for pagination.
 * @param {number} perPage - The number of items to show per page.
 * @param {string} orderBy - The sorting order ("asc" or "desc").
 * @param {string} search - Date to search for (optional).
 * @param {number} type - Type of filtering (1-6).
 * @returns {Object} - Object containing booking data and pagination information.
 */
const getDoctorBookingList = async (
  doctorId,
  page,
  perPage,
  orderBy,
  search,
  type
) => {
  const orderDirection = orderBy === "asc" ? "ASC" : "DESC";
  let whereClause = { DoctorId: doctorId };
  let orderClause = [];

  if (type === 1 || type === 2 || type === 3 || type === 4) {
    whereClause.status = type;

    const currentDate = new Date();
    const currentDateString = currentDate.toISOString().split("T")[0];
    const currentTimeString = currentDate.toTimeString().split(" ")[0];

    orderClause.push(
      [
        sequelize.literal(
          `CONCAT(date, ' ', timeSlot) = '${currentDateString} ${currentTimeString}' DESC`
        ),
      ],
      [sequelize.literal(`date = '${currentDateString}' DESC`)],
      ["date", orderDirection],
      [{ model: TimeSlot }, "timeSlot", orderDirection]
    );
  } else if (type === 5) {
    whereClause.date = { [Op.gte]: new Date() };
    orderClause.push(["date", "ASC"], ["updatedAt", orderDirection]);
  } else if (type === 6) {
    whereClause.date = { [Op.lt]: new Date() };
    orderClause.push(["date", "DESC"], ["updatedAt", orderDirection]);
  }

  if (search) {
    whereClause.date = search;
  }

  const offset = (page - 1) * perPage;

  const doctorBookings = await Booking.findAll({
    attributes: ["id", "date", "status", "updatedAt", "doctorId"],
    include: [
      {
        model: User,
        attributes: [
          "id",
          "firstName",
          "lastName",
          "email",
          "mobileNo",
          "gender",
          "dob",
        ],
      },
      {
        model: TimeSlot,
        attributes: ["id", "timeSlot"],
      },
      {
        model: History,
        attributes: ["id", "reason", "prescription"],
      },
    ],
    where: whereClause,
    order: orderClause,
    offset: offset,
    limit: perPage,
  });

  const totalCount = await Booking.count({
    where: { DoctorId: doctorId, ...whereClause },
  });

  const hasNext = doctorBookings.length > perPage;
  const hasPrevious = page > 1;

  const formattedBookings = doctorBookings.map((booking) => ({
    ...booking.toJSON(),
    date: booking.date.toISOString().split("T")[0],
  }));

  const bookingsToShow = hasNext
    ? formattedBookings.slice(0, perPage)
    : formattedBookings;

  return {
    totalCount,
    page,
    perPage,
    hasNext,
    hasPrevious,
    bookings: bookingsToShow,
  };
};

/**
 * Retrieves booking details by booking ID and associated doctor ID.
 *
 * @function
 * @async
 * @param {number} bookingId - The ID of the booking.
 * @param {number} doctorId - The ID of the doctor associated with the booking.
 * @returns {Object|null} - Booking details or null if not found.
 */
const findBookingByIdAndDoctor = async (bookingId) => {
  const booking = await Booking.findOne({
    where: { id: bookingId },
    include: [
      { association: "user" },
      { association: "timeslot" },
      {
        association: "doctor",
        include: [{ association: "specialty" }],
      },
    ],
  });
  return booking;
};

/**
 * Accepts a booking by updating its status to 'accepted'.
 *
 * @param {number} bookingId - The ID of the booking to accept.
 * @returns {Promise} - A Promise that resolves when the booking status is updated.
 */
const acceptBooking = async (bookingId) => {
  // Update the booking status to 'accepted'.
  await Booking.update(
    { status: BOOKING_STATUS.ACCEPTED },
    { where: { id: bookingId } }
  );
};

/**
 * Rejects a booking by updating its status to 'rejected' in the database.
 *
 * @function
 * @async
 * @param {number} bookingId - The ID of the booking to be rejected.
 */
const rejectBooking = async (bookingId) => {
  // Update the booking status to 'rejected'.
  await Booking.update(
    { status: BOOKING_STATUS.REJECTED },
    { where: { id: bookingId } }
  );
};

/**
 * Cancel a booking by updating its status to 'Cancelled'.
 *
 * @param {number} bookingId - The ID of the booking to reject.
 * @returns {Promise} - A Promise that resolves when the booking status is updated.
 */
const cancelBooking = async (bookingId) => {
  await Booking.update(
    { status: BOOKING_STATUS.CANCELED },
    { where: { id: bookingId } }
  );
};

/**
 * Changes the booking time for an appointment by a doctor.
 *
 * @function
 * @async
 * @param {number} bookingId - ID of the booking to be updated.
 * @param {number} doctorId - ID of the doctor making the change.
 * @param {number} newTime - ID of the new timeslot.
 * @returns {Promise<Object>} Updated booking information.
 * @throws {CustomError} If booking is not found or not modifiable, or if the requested time is not available.
 */
const changeBookingTimeByDoctor = async (bookingId, newTime) => {
  const booking = await Booking.findOne({
    where: { id: bookingId, status: BOOKING_STATUS.ACCEPTED },
  });

  if (!booking) {
    const customError = createCustomError(
      "Booking not found or not modifiable.",
      404
    );
    throw customError;
  }

  const isAvailable = await checkTimeAvailability(
    booking.date,
    newTime,
    bookingId
  );

  if (isAvailable) {
    const customError = createCustomError(
      "Requested time is not available for booking. Please choose a different time.",
      400
    );
    throw customError;
  }

  await booking.update({ timeslotId: newTime }, { where: { id: bookingId } });

  const updatedBooking = await Booking.findOne({
    where: { id: bookingId },
    include: [
      {
        model: User,
        attributes: ["email", "firstName", "lastName"],
      },
      {
        model: TimeSlot,
      },
      {
        model: Doctor,
        attributes: ["name"],
        include: [
          {
            model: Hospital,
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  });

  const userEmail = updatedBooking.user.email;
  const userName = `${updatedBooking.user.firstName} ${updatedBooking.user.lastName}`;
  const bookingDate = updatedBooking.date.toISOString().split("T")[0];
  const doctorName = "Dr. " + updatedBooking.doctor.name;
  const hospitalName = updatedBooking.doctor.hospital.name;
  const newTimeSlot = updatedBooking.timeslot.dataValues.timeSlot;

  sendBookingTimeChangedEmail(
    userEmail,
    userName,
    bookingDate,
    newTimeSlot,
    doctorName,
    hospitalName
  );

  return booking;
};

const checkTimeAvailability = async (bookingDate, timeSlotId, bookingId) => {
  // Find any bookings with the same time slot ID, date
  const existingBookings = await Booking.findOne({
    where: {
      timeSlotId: timeSlotId,
      date: bookingDate,
    },
  });

  return existingBookings;
};

/**
 * Retrieves a list of bookings for a specific user.
 *
 * @function
 * @async
 * @param {number} userId - ID of the user.
 * @param {number} limit - Maximum number of items per page.
 * @param {number} page - Page number to retrieve.
 * @returns {Object} An object containing the list of bookings and total count.
 */
const userBookingList = async (userId, limit, page) => {
  const bookings = await Booking.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: { userId: userId },
    order: [["date", "DESC"]],
    include: [
      { model: TimeSlot },
      {
        model: Doctor,
        attributes: ["name", "email", "designation"],
        include: [
          {
            model: Specialty,
            attributes: ["id", "specialtyName", "description"],
          },
          {
            model: Hospital,
            attributes: ["id", "name", "address", "email", "contactNo"],
          },
        ],
      },
    ],
  });

  return {
    items: bookings.rows,
    count: bookings.count,
  };
};

/**
 * Retrieves booking details based on the provided booking ID and request information.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the booking ID and user information.
 * @returns {Promise<Object>} - A Promise that resolves to the retrieved booking details.
 */
const getBookingDetails = async (req) => {
  const bookId = await Booking.findByPk(req.params.id, {
    include: [
      { model: TimeSlot },
      { model: Doctor, attributes: ["name", "id", "email"] },
    ],
  });

  if (!bookId) {
    // Create custom error if the booking id not found
    const error = createCustomError("Booking Id not found", 404);
    throw error;
  } else if (
    //throw error if the user or doctor is not associated with the
    (req.user.role === USER_ROLES.USER &&
      req.user.id !== bookId.dataValues.userId) ||
    (req.user.role === USER_ROLES.DOCTOR &&
      req.user.id !== bookId.dataValues.doctorId)
  ) {
    const error = createCustomError(
      "Current user doesn’t have permission to perform this action",
      403
    );
    throw error;
  }
  return bookId;
};

/**
 * Retrieves available time slots for a given doctor on a specific date.
 *
 * @function
 * @async
 * @param {number} doctorId - The ID of the doctor for whom to retrieve available time slots.
 * @param {string} date - The date for which to retrieve available time slots.
 * @returns {Promise<Array>} - A Promise that resolves to an array of available time slots.
 */
const getAvailableTimeSlots = async (doctorId, date) => {
  let availableTimeslots;
  //check if the doctor is unavailable in the provided dates
  const doctorLeave = await Leave.findAll({
    where: {
      doctorId: doctorId,
      status: COMMON_STATUS.ACTIVE,
      [Op.or]: {
        startDate: date,
        endDate: date,
      },
    },
  });

  //get all the timeslots that the doctor is unavailable
  const leaveSlots = doctorLeave.map((leave) => leave.timeslotId);

  //check if the doctor has already bookings(approved/pending) in that particular date
  const bookingSlot = await Booking.findAll({
    where: {
      doctorId: doctorId,
      [Op.or]: {
        status: [BOOKING_STATUS.PENDING, BOOKING_STATUS.APPROVED],
      },
      date: date,
    },
  });

  //get all the timeslots that the doctors have bookings
  const bookingSlots = bookingSlot.map((booking) => booking.timeslotId);

  //combine the allocated slots from leave and bookings
  const allocatedSlots = [...leaveSlots, ...bookingSlots];

  const providedDate = new Date(date);
  const currentDate = new Date();

  let whereCondition = {
    status: COMMON_STATUS.ACTIVE,
    id: {
      [Op.notIn]: allocatedSlots,
    },
  };

  if (
    providedDate.getFullYear() === currentDate.getFullYear() &&
    providedDate.getMonth() === currentDate.getMonth() &&
    providedDate.getDate() === currentDate.getDate()
  ) {
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");

    const currentTime = `${hours}:${minutes}:${seconds}`;

    whereCondition[Op.and] = [literal(`TIME(timeSlot) > '${currentTime}'`)];
  }

  //get all available slots of a doctor
  availableTimeslots = await TimeSlot.findAll({
    where: whereCondition,
    attributes: ["id", "timeSlot"],
  });

  return availableTimeslots;
};

/**
 * Checks if a provided time slot is in the future compared to the current date and time.
 *
 * @function
 * @async
 * @param {number} timeSlotId - The ID of the time slot to check.
 * @param {string} date - The date for which the time slot is being checked.
 * @returns {Promise<void>} - A Promise that resolves if the time slot is valid, or throws an error if not.
 * @throws {CustomError} - Throws a custom error if the provided time slot is not in the future.
 */
const checkSlotTime = async (timeSlotId, date) => {
  const providedDate = new Date(date);
  const currentDate = new Date();

  if (
    //checks if the provided date and current date is same
    providedDate.getFullYear() === currentDate.getFullYear() &&
    providedDate.getMonth() === currentDate.getMonth() &&
    providedDate.getDate() === currentDate.getDate()
  ) {
    const hours = currentDate.getHours().toString().padStart(2, "0");
    const minutes = currentDate.getMinutes().toString().padStart(2, "0");
    const seconds = currentDate.getSeconds().toString().padStart(2, "0");

    const currentTime = `${hours}:${minutes}:${seconds}`;

    //checks if the provided slot is lessthan current time
    const availableTimeslots = await TimeSlot.findAll({
      where: {
        status: COMMON_STATUS.ACTIVE,
        id: timeSlotId,
        [Op.and]: [literal(`TIME(timeSlot) < '${currentTime}'`)],
      },
      attributes: ["id", "timeSlot"],
    });

    if (availableTimeslots.length != 0) {
      const error = createCustomError("Please select future time slots", 400);
      throw error;
    }
  }
};

/**
 * Get a list of blogs based on specified criteria.
 *
 * @async
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The maximum number of items per page.
 * @param {string|null} search - The search query for filtering blogs by title.
 * @param {number[]|null} doctors - An array of doctor IDs for filtering blogs by doctor.
 * @returns {Promise<{ items: Blog[], count: number }>} - A Promise that resolves to an object containing the list of blogs and the total count.
 * @throws {Error} - If there's an error during the database query.
 */

const getBlogList = async (page, limit, search, doctors) => {
  console.log(doctors);
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  let includeClause = [
    { model: Doctor, as: "doctor", include: [{ model: Hospital }] },
  ];
  if (doctors?.length > 0) {
    whereClause.doctorId = {
      [Op.in]: doctors,
    };
  }
  if (search) {
    whereClause.title = { [Op.like]: `%\\${search}%` };
  }
  const list = await Blog.findAndCountAll({
    include: includeClause,
    offset: (page - 1) * limit,
    limit: limit,
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });
  return {
    items: list.rows,
    count: list.count,
  };
};

/**
 * Get a list of bookings based on specified criteria.
 *
 * @async
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The maximum number of items per page.
 * @param {string|null} search - The search query for filtering bookings by title.
 * @param {number[]|null} doctors - An array of doctor IDs for filtering bookings by doctor.
 * @returns {Promise<{ items: Booking[], count: number }>} - A Promise that resolves to an object containing the list of bookings and the total count.
 * @throws {Error} - If there's an error during the database query.
 */
const getAllBookings = async (page, limit, search) => {
  const whereClause = {
    status: {
      [Op.in]: [1, 2, 3, 4],
    },
  };

  const includeClause = [
    {
      model: User,
      as: "user",
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "dob",
        "gender",
        "mobileNo",
        "status",
      ],
      where: { status: COMMON_STATUS.ACTIVE },
    },
    {
      model: Doctor,
      as: "doctor",
      attributes: ["id", "name", "email", "experience"],
      where: { status: COMMON_STATUS.ACTIVE },
    },
    {
      model: TimeSlot,
      as: "timeslot",
      attributes: ["id", "timeSlot"],
      where: { status: COMMON_STATUS.ACTIVE },
    },
  ];

  const list = await Booking.findAndCountAll({
    include: includeClause,
    offset: (page - 1) * limit,
    limit,
    where: whereClause,
  });

  return {
    items: list.rows,
    count: list.count,
  };
};

const getBookingsByDoctorIds = async (page, limit, search, doctorIds) => {
  const whereClause = {
    status: {
      [Op.in]: [1, 2, 3, 4],
    },
    doctorId: {
      [Op.in]: doctorIds,
    },
  };

  const includeClause = [
    {
      model: User,
      as: "user",
      attributes: [
        "id",
        "firstName",
        "lastName",
        "email",
        "dob",
        "gender",
        "mobileNo",
        "status",
      ],
      where: { status: COMMON_STATUS.ACTIVE },
    },
    {
      model: Doctor,
      as: "doctor",
      attributes: ["id", "name", "email", "experience"],
      where: { status: COMMON_STATUS.ACTIVE },
      include: [
        {
          model: Hospital,
          attributes: ["id", "name"],
        },
      ],
    },
    {
      model: TimeSlot,
      as: "timeslot",
      attributes: ["id", "timeSlot"],
      where: { status: COMMON_STATUS.ACTIVE },
    },
  ];

  const list = await Booking.findAndCountAll({
    include: includeClause,
    offset: (page - 1) * limit,
    limit,
    where: whereClause,
  });

  return {
    items: list.rows,
    count: list.count,
  };
};

const changeBookingTime = async (bookingId, newTime, userId, userRole) => {
  let booking;
  let UpdateBooking;
  let bookingWhereCondition = {};
  let bookingInclude = [];

  if (userRole === "SUPERADMIN") {
    // For SUPERADMIN, allow changing time for any booking
    bookingWhereCondition = {
      id: bookingId,
      status: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.PENDING],
    };
  } else if (userRole === "ADMIN") {
    // For ADMIN, check if the booking belongs to a doctor in the admin's hospital
    bookingWhereCondition = {
      id: bookingId,
      status: [BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.PENDING],
    };
    bookingInclude = [
      {
        model: User,
        attributes: ["email", "firstName", "lastName"],
      },
      {
        model: TimeSlot,
        attributes: ["id", "timeSlot"],
      },
      {
        model: Doctor,
        attributes: ["name"],
        include: [
          {
            model: Hospital,
            attributes: ["id", "adminId", "name"],
            where: {
              adminId: userId,
            },
          },
        ],
      },
    ];
  }

  booking = await Booking.findOne({
    where: bookingWhereCondition,
  });

  if (!booking) {
    const customError = createCustomError(
      "Booking not found or not modifiable.",
      404
    );
    throw customError;
  }

  // Check time availability
  const isAvailable = await checkTimeAvailability(
    booking.date,
    newTime,
    bookingId
  );

  if (isAvailable) {
    const customError = createCustomError(
      "Requested time is not available for booking. Please choose a different time.",
      400
    );
    throw customError;
  }

  // Update the booking time
  await booking.update({ timeslotId: newTime });

  UpdateBooking = await Booking.findOne({
    where: bookingWhereCondition,
    include: bookingInclude,
  });

  const userEmail = UpdateBooking?.user?.email;
  const userName = UpdateBooking?.user
    ? `${UpdateBooking.user.firstName} ${UpdateBooking.user.lastName}`
    : "";
  const bookingDate = UpdateBooking?.date
    ? UpdateBooking.date.toISOString().split("T")[0]
    : "";
  const doctorName = UpdateBooking?.doctor
    ? "Dr. " + UpdateBooking.doctor.name
    : "";
  const hospitalName = UpdateBooking?.doctor?.hospital
    ? UpdateBooking.doctor.hospital.name
    : "";
  const newTimeSlot = UpdateBooking?.timeslot?.dataValues?.timeSlot || "";

  sendBookingTimeChangedEmail(
    userEmail,
    userName,
    bookingDate,
    newTimeSlot,
    doctorName,
    hospitalName
  );

  return booking;
};

module.exports = {
  getAllBookings,
  getBookingsByDoctorIds,
  getBlogList,
  userAdd,
  getUserByEmail,
  getOtpEmail,
  addBooking,
  doctorAvailable,
  getDoctorBookingList,
  acceptBooking,
  rejectBooking,
  findBookingByIdAndDoctor,
  getAllPatients,
  getHistory,
  emailAdd,
  updateOtp,
  getPatient,
  cancelBooking,
  getById,
  updateBooking,
  userBookingList,
  changeBookingTimeByDoctor,
  checkTimeAvailability,
  getBookingDetails,
  getAvailableTimeSlots,
  getHospitalId,
  checkSlotTime,
  getUser,
  userExists,
  changeBookingTime,
};
