const Doctor = require("../Model/doctorModel");
const SubSpecialty = require("../Model/subSpecialtyModel");
const Specialty = require("../Model/specialtyModel");
const { Op, where } = require("sequelize");
const Booking = require("../Model/bookingModel");
const sequelize = require("../database");
const History = require("../Model/history");
const { createCustomError } = require("../Middleware/Errors/errorHandler");
const moment = require("moment");
const { COMMON_STATUS } = require("../Util/constants");
const { deleteUploadedFile } = require("../Util/fileUpload");
const Hospital = require("../Model/hospitalModel");

/**
 * Finds a doctor by email and checks if their status is active.
 *
 * @function
 * @async
 * @param {Object} body - An object containing the doctor's email.
 * @returns {Promise<Object>} - The found doctor's data.
 * @throws {CustomError} - If the doctor is not found or their status is not active.
 */
const doctorLogin = async (body) => {
  const user = await Doctor.findOne({
    where: {
      email: body.email,
      status: COMMON_STATUS.ACTIVE,
    },
  });
  if (!user) {
    const error = createCustomError("User not found", 400);
    throw error;
  }
  return user;
};

/**
 * Resets the password for a user with the specified email.
 *
 * @function
 * @async
 * @param {string} email - The email of the user whose password needs to be reset.
 * @param {string} password - The new hashed password.
 * @returns {void}
 */
const resetPassword = async (email, password) => {
  await Doctor.update({ password: password }, { where: { email: email } });
};

/**
 * Retrieves doctor details by doctor ID and handles version checking if provided.
 *
 * @function
 * @async
 * @param {number} doctorId - The ID of the doctor to retrieve.
 * @param {string} version - The version to check for, if provided.
 * @returns {Promise<Object>} - A Promise that resolves to the retrieved doctor details.
 * @throws {CustomError} - Throws a custom error if the doctor is not found or version mismatch occurs.
 */
const getById = async (doctorId, version, file) => {
  const userDetails = await Doctor.findOne({
    where: { id: doctorId, status: COMMON_STATUS.ACTIVE },
    attributes: [
      "id",
      "name",
      "email",
      "designation",
      "experience",
      "version",
      "qualification",
      "imageKey",
      "hospitalId",
    ],
  });
  if (!userDetails) {
    // Create custom error
    const error = createCustomError("DoctorId not found", 404);
    throw error;
  }
  if (version) {
    if (userDetails.dataValues.version !== parseInt(version)) {
      const uploadedFileKey = file ? file.key : null;

      // Delete the uploaded file if it exists
      if (uploadedFileKey) {
        try {
          await deleteUploadedFile(uploadedFileKey);
        } catch (deleteError) {
          console.error("Error deleting uploaded file:", deleteError);
        }
      }

      // Create custom error
      const error = createCustomError("VersionMismatch", 400);
      throw error;
    }
  }

  return userDetails;
};

/**
 * Checks if a user with the specified email exists.
 *
 * @function
 * @async
 * @param {string} email - The email to check for existence.
 * @returns {Object|null} - The user object if found, or null if not found.
 */
const userExists = async (email) => {
  const user = await Doctor.findOne({
    where: {
      email: email,
      status: COMMON_STATUS.ACTIVE,
    },
  });
  return user;
};

/**
 * Update the profile information of a doctor.
 *
 * @function
 * @async
 * @param {Object} data - The updated data for the doctor's profile.
 * @param {Object} user - The user (doctor) object with the doctor's ID.
 */
const profileUpdate = async (data, user) => {
  await Doctor.update(data, { where: { id: user.id } });
};

/**
 * Function to add doctor details to a table
 * @param {object} data  - The data of doctor to be added
 */
const doctorAdd = async (data) => {
  await Doctor.create(data);
};

const editDoctor = async (data, id) => {
  await Doctor.update(data, { where: { id: id } });
};

/**
 * Get a list of doctors based on the provided criteria.
 *
 * @function
 * @async
 * @param {number} id - The ID of the entity (subspecialty, specialty, or hospital) to filter by.
 * @param {number} type - The type of entity (0: subspecialty, 1: specialty, 2: hospital) to filter by.
 * @param {number} limit - The maximum number of items per page.
 * @param {number} page - The page number to retrieve.
 * @param {string} search - The search keyword for doctor names.
 * @param {number|null} lastPageLastIndex - The index of the last item on the previous page (optional).
 * @returns {Object} - An object containing the list of doctors and the total count.
 */
const doctorList = async (id, type, limit, page, search, lastPageLastIndex) => {
  let whereClause = {};
  let includeClause = [
    { model: SubSpecialty, as: "subspecialty" },
    { model: Specialty, as: "specialty" },
  ];

  //returns all doctors under a particular sub speciality
  if (type === 0) {
    whereClause = { subspecialtyId: id, status: COMMON_STATUS.ACTIVE };
  } else if (type === 1) {
    //returns all doctors under a particular speciality
    whereClause = { specialtyId: id, status: COMMON_STATUS.ACTIVE };
  } else if (type === 2) {
    // returns list of all doctors under a hospital
    whereClause = { hospitalId: id, status: COMMON_STATUS.ACTIVE };
  }

  if (search) {
    whereClause.name = { [Op.like]: `%\\${search}%` };
  }

  const lastElement = lastPageLastIndex
    ? await Doctor.findOne({
        where: whereClause,
        include: includeClause,
        order: [["email", "DESC"]],
        limit: 1,
        offset: (page - 2) * limit,
        attributes: ["email"],
      })
    : null;

  const offset = lastElement ? (page - 1) * limit : 0;

  const doctor = await Doctor.findAndCountAll({
    limit: limit,
    offset: offset,
    where: whereClause,
    include: includeClause,
    order: [
      ["experience", "DESC"],
      ["email", "DESC"],
    ],
    attributes: { exclude: ["password"] },
  });

  const count = doctor.count;
  const doctors = experienceCalculation(doctor.rows);

  return {
    items: doctors,
    count: count,
  };
};

/**
 * Function get list of the doctors
 * @param {*} hospitalId - id of the hospital
 * @param {*} limit
 * @param {*} page
 * @param {*} search
 * @param {*} specialtyId
 * @param {*} subspecialtyId
 * @returns
 */
const getAllDoctorsList = async (
  hospitalId,
  limit,
  page,
  search,
  specialtyId,
  subspecialtyId
) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  if (hospitalId?.length!=0) {
    whereClause.hospitalId = hospitalId;
  }
  if (specialtyId?.length!=0) {
    whereClause.specialtyId = specialtyId;
  }
  if (subspecialtyId?.length!=0) {
    whereClause.subspecialtyId = subspecialtyId;
  }
  if (search) {
    whereClause.name = { [Op.like]: `%\\${search}%` };
  }

  let includeClause = [
    { model: Hospital, as: "hospital" },
    { model: SubSpecialty, as: "subspecialty" },
    { model: Specialty, as: "specialty" },
  ];

  const doctor = await Doctor.findAndCountAll({
    include: includeClause,
    offset: (page - 1) * limit,
    limit: limit,
    attributes: { exclude: ["password"] },
    where: whereClause,
    order : [['createdAt','DESC']]
  });

  const count = doctor.count;
  const doctors = experienceCalculation(doctor.rows);
  return {
    items: doctors,
    count: count,
  };
};

/**
 * Get detailed information about a specific doctor.
 *
 * @function
 * @async
 * @param {number} doctorId - The ID of the doctor to retrieve details for.
 * @returns {Object} - An object containing the doctor's detailed information.
 * @throws {CustomError} If the doctor with the specified ID is not found.
 */
const doctorView = async (doctorId) => {
  const doctor = await Doctor.findOne({
    where: { status: COMMON_STATUS.ACTIVE, id: doctorId },
    attributes: { exclude: ["password"] },
    include: [
      { model: Specialty },
      { model: SubSpecialty },
      { model: Hospital },
    ],
  });
  if (!doctor) {
    // Create custom error
    const error = createCustomError("DoctorId not found", 404);
    throw error;
  }
  return doctor;
};

/**
 * Add diagnostic history for a patient based on the provided data and logged-in doctor.
 *
 * @function
 * @async
 * @param {Object} data - Data containing information for creating diagnostic history.
 * @param {Object} loggedInDoctor - The currently logged-in doctor's information.
 */
const DiagnosticHistory = async (data, loggedInDoctor) => {
  const bookingId = data.bookingId;

  // Check if the logged-in doctor has the permission to add diagnostic history
  const booking = await Booking.findOne({
    where: { id: bookingId, status: PACKAGE_STATUS.ACCEPTED },
  });

  if (!booking) {
    const customError = createCustomError(
      "Invalid booking or booking is not accepted.",
      400
    );
    throw customError;
  }

  if (booking.doctorId !== loggedInDoctor.id) {
    const customError = createCustomError(
      "Current user doesn’t have permission to perform this action",
      403
    );
    throw customError;
  }

  const currentDate = new Date();
  const bookingDate = new Date(booking.date);

  // Set the time to midnight for both dates to compare only the dates, not the exact times
  currentDate.setHours(0, 0, 0, 0);
  bookingDate.setHours(0, 0, 0, 0);

  // Compare the dates
  if (currentDate < bookingDate) {
    const customError = createCustomError(
      "Diagnostic history can only be added on the booking date or in the Past.",
      400
    );
    throw customError;
  }

  const existingHistory = await History.findOne({
    where: { bookingId },
  });

  if (existingHistory) {
    const customError = createCustomError(
      "Diagnostic history already exists for this booking.",
      400
    );
    throw customError;
  }

  // Now add the diagnostic history
  const historyData = {
    ...data,
    status: PACKAGE_STATUS.ACCEPTED,
    bookingId: booking.id,
  };
  const create = await History.create(historyData);
};

/**
 * Retrieve a list of best doctors based on specific criteria.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @returns {Object} - An object containing the list of best doctors and metadata.
 */
const bestDoctors = async (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  let specialtyId = req.query.specialtyId;
  const hospitalId = req.query.hospitalId;
  let totalResultsCount;

  let whereClause = { status: COMMON_STATUS.ACTIVE };

  //filter based on specialty and hospital
  if (hospitalId && specialtyId) {
    whereClause.specialtyId = specialtyId;
    whereClause.hospitalId = hospitalId;
  } else if (specialtyId) {
    //filter based on specialty

    whereClause.specialtyId = specialtyId;
  } else if (hospitalId) {
    //filter based on hospital id

    whereClause.hospitalId = hospitalId;
  }

  const subquery = `(SELECT COUNT(*) FROM bookings WHERE bookings.doctorId = doctor.id)`;

  const doctors = await Doctor.findAll({
    attributes: [
      "id",
      "name",
      "email",
      "designation",
      "qualification",
      "experience",
      "imageKey",
      "version",
      "createdAt",
      "subspecialtyId",
      "specialtyId",

      [sequelize.literal(subquery), "bookingCount"],
    ],
    where: whereClause,
    order: [[sequelize.literal("bookingCount"), "DESC"]],
    include: [
      { model: Booking, attributes: [] }, // Include Booking model for the subquery to work
      { model: Specialty },
      { model: SubSpecialty },
    ],
    offset: (page - 1) * limit,
    limit: limit,
  });

  //update the experinece of the doctors with current date
  const newDoctors = experienceCalculation(doctors);

  totalResultsCount = await Doctor.count({ where: whereClause });
  const totalPages = Math.ceil(totalResultsCount / limit);
  const hasNext = page < totalPages;

  const response = {
    items: newDoctors,
    count: totalResultsCount,
    hasNext,
    currentPage: page,
    totalPages,
  };

  return response;
};

/**
 * Calculate and update the experience of doctors in years with fractions for months and days.
 *
 * @function
 * @param {Array} doctors - An array of doctors with their information.
 * @returns {Array} - An array of doctors with updated experience values.
 */
function experienceCalculation(doctors) {
  const doctorsWithNewExperience = doctors.map((doctor) => {
    const createdAt = moment(doctor.createdAt);
    const currentDate = moment();
    const diffDuration = moment.duration(currentDate.diff(createdAt));
    const experienceYears =
      doctor.experience +
      diffDuration.years() +
      diffDuration.months() / 12 +
      diffDuration.days() / 365;

    return {
      ...doctor.dataValues,
      experience: experienceYears.toFixed(1), // Convert to 1 decimal place
    };
  });
  return doctorsWithNewExperience;
}

/**
 * Get a sub-specialty by its ID and validate its active status.
 *
 * @function
 * @async
 * @param {number} id - The ID of the sub-specialty to retrieve.
 */
const getSubSpecialtyId = async (id) => {
  const subSpecialityId = await SubSpecialty.findByPk(id, {
    where: { status: COMMON_STATUS.ACTIVE },
  });
  if (!subSpecialityId) {
    // Create custom error
    const error = createCustomError("Sub speciality Id not found", 404);
    throw error;
  }
};

/**
 * Get a specialty by its ID and validate its active status.
 *
 * @function
 * @async
 * @param {number} id - The ID of the specialty to retrieve.
 */
const getSpecialty = async (id) => {
  const specialityId = await SubSpecialty.findByPk(id, {
    where: { status: COMMON_STATUS.ACTIVE },
  });
  if (!specialityId) {
    // Create custom error
    const error = createCustomError("Speciality Id not found", 404);
    throw error;
  }
};

/**Function to delete doctor */
const doctorDelete = async (id) => {
  await Doctor.update(
    { status: COMMON_STATUS.INACTIVE },
    { where: { id: id } }
  );
};

const getAllDoctorsByHospitalId = async (hospitalId) => {
  return await Doctor.findAll({
    where: {
      hospitalId,
      status: COMMON_STATUS.ACTIVE,
    },
  });
};

module.exports = {
  getAllDoctorsByHospitalId,
  getAllDoctorsList,
  doctorDelete,
  editDoctor,
  doctorAdd,
  doctorLogin,
  resetPassword,
  getById,
  profileUpdate,
  doctorList,
  doctorView,
  DiagnosticHistory,
  bestDoctors,
  userExists,
  getSubSpecialtyId,
  getSpecialty,
};
