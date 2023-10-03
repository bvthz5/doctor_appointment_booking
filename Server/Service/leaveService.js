const TimeSlot = require("../Model/timeSlotModel");
const Leave = require("../Model/leaveModel");
const { Op } = require("sequelize");
const errorMessages = require("../Middleware/Errors/errorMessages");
const Booking = require("../Model/bookingModel");
const bookingService = require("../Service/bookingService");
const { sendCancelledBookingEmail } = require("../Util/mail");
const Doctor = require("../Model/doctorModel");
const sequelize = require("../database");
const { COMMON_STATUS } = require("../Util/constants");
const Hospital = require("../Model/hospitalModel");

/**
 * Get all time slots available for full-day leave.
 *
 * @function
 * @async
 * @returns {Array} - Array of time slots.
 */
const getFullLeaveTimeSlots = async () => {
  return await TimeSlot.findAll();
};

/**
 * Get time slots available for half-day leave within a specified time range.
 *
 * @function
 * @async
 * @param {string} start - Start time of the time range.
 * @param {string} end - End time of the time range.
 * @returns {Array} - Array of time slots.
 */
const getHalfLeaveTimeSlots = async (start, end) => {
  const Slots = await TimeSlot.findAll({
    where: {
      timeSlot: {
        [Op.between]: [start, end],
      },
    },
  });

  return Slots;
};

/**
 * Get custom time slots for leave based on the provided timeSlotIds.
 *
 * @function
 * @async
 * @param {Array} timeSlotIds - Array of time slot IDs.
 * @returns {(string|Array)} - Error message or array of time slots.
 */
const getCustomLeaveTimeSlots = async (timeSlotIds) => {
  if (timeSlotIds.length === 0) {
    return errorMessages.CUSTOM_LEAVE_EMPTY;
  }

  const timeSlots = await getTimeSlotsByIds(timeSlotIds);
  if (timeSlots.length === 0) {
    return errorMessages.INVALID_CUSTOM_LEAVE;
  } else {
    return timeSlots;
  }
};

/**
 * Determine leave type and retrieve corresponding time slots.
 *
 * @function
 * @async
 * @param {number} type - Leave type code.
 * @param {Array} timeSlotIds - Array of time slot IDs (used for custom leave).
 * @returns {(Array|string)} - Array of time slots or error message.
 */
const getLeaveType = async (type, timeSlotIds) => {
  switch (type) {
    case 0:
      // Full leave
      return await getFullLeaveTimeSlots();

    case 1:
      // Half leave Morning
      return await getHalfLeaveTimeSlots("10:00", "13:00");

    case 2:
      // Half leave Evening
      return await getHalfLeaveTimeSlots("13:00", "17:00");

    case 3:
      // Custom leave
      return await getCustomLeaveTimeSlots(timeSlotIds);

    default:
      return errorMessages.INVALID_LEAVE_TYPE;
  }
};

/**
 * Retrieve time slots based on the provided array of timeSlotIds.
 *
 * @function
 * @async
 * @param {Array} timeSlotIds - Array of time slot IDs.
 * @returns {Array} - Array of retrieved time slots.
 */
const getTimeSlotsByIds = async (timeSlotIds) => {
  let timeSlots = [];
  for (let ids of timeSlotIds) {
    await TimeSlot.findAll({
      where: {
        id: ids,
      },
    }).then((response) => {
      if (response.length > 0) timeSlots.push(response[0]);
    });
  }

  return timeSlots;
};

/**
 * Check if leave entries already exist for the given doctorId, startDate, endDate, and timeSlotIds.
 *
 * @function
 * @async
 * @param {number} doctorId - ID of the doctor.
 * @param {Date} startDate - Start date of the leave.
 * @param {Date} endDate - End date of the leave.
 * @param {Array} timeSlotIds - Array of time slot IDs.
 * @returns {boolean} - true if leave entries exist, false otherwise.
 */
const checkIfLeaveExists = async (
  doctorId,
  startDate,
  endDate,
  timeSlotIds
) => {
  const existingLeave = await Leave.findAll({
    where: {
      doctorId,
      startDate,
      endDate,
      timeslotId: timeSlotIds,
    },
  });
  return existingLeave.length > 0;
};

/**
 * Check if leave entries already exist for the given doctorId, startDate, and endDate for a full day leave.
 *
 * @function
 * @async
 * @param {number} doctorId - ID of the doctor.
 * @param {Date} startDate - Start date of the leave.
 * @param {Date} endDate - End date of the leave.
 * @returns {boolean} - true if leave entries exist, false otherwise.
 */
const checkIfLeaveExistsForFullDay = async (doctorId, startDate, endDate) => {
  const existingLeave = await Leave.findAll({
    where: {
      doctorId,
      startDate,
      endDate,
    },
  });
  return existingLeave.length > 0;
};

/**
 * Change the leave status for a doctor.
 *
 * @function
 * @async
 * @param {number} doctorId - Doctor ID.
 * @param {string} startDate - Start date of the leave.
 * @param {string} endDate - End date of the leave.
 * @param {number} type - Leave type.
 * @param {number[]} timeSlotIds - Array of time slot IDs.
 * @returns {(boolean|string)} - `true` if leave status changed successfully, or an error message.
 */
const changeDoctorLeaveStatus = async (
  doctorId,
  startDate,
  endDate,
  type,
  timeSlotIds
) => {
  let leaveExists = false;
  if (type === 0 || type === 1 || type === 2) {
    leaveExists = await checkIfLeaveExistsForFullDay(
      doctorId,
      startDate,
      endDate
    );
  } else if (type === 3) {
    leaveExists = await checkIfLeaveExists(
      doctorId,
      startDate,
      endDate,
      timeSlotIds
    );
  }

  if (leaveExists) {
    return errorMessages.LEAVE_ALREADY_EXISTS;
  }

  let timeSlots = await getLeaveType(type, timeSlotIds);

  const timeSlotIdsArray = timeSlots.map((slot) => {
    return slot.dataValues.id;
  });

  const conflictingBookings = await Booking.findAll({
    where: {
      doctorId,
      timeslotId: timeSlotIdsArray,
      status: PACKAGE_STATUS.ACCEPTED,
    },
    include: [
      { association: "user" },
      { association: "doctor" },
      { association: "timeslot" },
    ],
  });

  if (conflictingBookings.length > 0) {
    for (const booking of conflictingBookings) {
      await bookingService.cancelBooking(booking.id);

      const userEmail = booking.user.email;
      const userName = booking.user.firstName + " " + booking.user.lastName;
      const doctorName = booking.doctor.name;
      const bookingId = booking.id;
      sendCancelledBookingEmail(userEmail, userName, bookingId, doctorName);
    }
  }

  const leaveData = timeSlotIdsArray.map((timeSlotId) => {
    return {
      doctorId,
      startDate,
      endDate,
      status: 1,
      timeslotId: parseInt(timeSlotId),
    };
  });

  await Leave.bulkCreate(leaveData);

  return true;
};

/**
 * Retrieve a list of leave records with pagination.
 *
 * @function
 * @async
 * @param {number} page - Page number.
 * @param {number} limit - Number of records to retrieve per page.
 * @returns {Object} - Object containing the list of leave records, totalRecords, and hasPrevious flag.
 */
const getAllLeaves = async (page, limit, searchParams) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };

  if (searchParams.startDate) {
    whereClause.startDate = searchParams.startDate;
  }

  if (searchParams.endDate) {
    whereClause.endDate = searchParams.endDate;
  }

  const leaves = await Leave.findAll({
    attributes: [
      "id",
      [sequelize.fn("DATE", sequelize.col("startDate")), "startDate"],
      [sequelize.fn("DATE", sequelize.col("endDate")), "endDate"],
      "status",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: Doctor,
        attributes: ["id", "name"],
        where: searchParams.doctorName
          ? { name: { [sequelize.Op.like]: `%${searchParams.doctorName}%` } }
          : {},
          include: [
            {
              model: Hospital,
              attributes: ["name"], 
            },
          ],
      },
      {
        model: TimeSlot,
        attributes: ["id", "timeSlot"],
      },
    ],
    where: whereClause,
    order: [["updatedAt", "DESC"]],
    limit,
    offset: (page - 1) * limit,
  });

  const totalRecords = await Leave.count({ where: whereClause });

  // Calculate hasPrevious based on the current page
  const hasPrevious = page > 1;

  return { leaves, totalRecords, hasPrevious };
};

/**
 * Retrieve a specific leave record by its ID and doctor's user ID.
 *
 * @function
 * @async
 * @param {number} leaveId - ID of the leave record.
 * @param {number} userId - ID of the associated doctor user.
 * @returns {Object|null} - The leave record if found, or null if not found.
 */
const listLeaveById = async (leaveId, userId) => {
  const listById = await Leave.findOne({
    where: { id: leaveId, doctorId: userId, status: COMMON_STATUS.ACTIVE },
  });
  return listById;
};

/**
 * Delete a leave record by its ID.
 *
 * @function
 * @async
 * @param {number} leaveId - ID of the leave record to be deleted.
 * @returns {number} - The number of updated rows (should be 1 if successful).
 */
const deleteLeaveById = async (leaveId) => {
  // Update the blog's status to "0" (deleted) in the database
  const deleteLeave = await Leave.update(
    { status: COMMON_STATUS.INACTIVE },
    { where: { id: leaveId } }
  );
  return deleteLeave;
};

/**
 * Get available time slots for a specific doctor on a given date.
 *
 * @function
 * @async
 * @param {number} doctorId - ID of the doctor.
 * @param {string} date - Date for which to find available time slots.
 * @returns {Array} - Array of available time slots.
 */
const getTimeSlotsAvailability = async (doctorId, date) => {
  const doctorLeave = await Leave.findAll({
    where: {
      doctorId,
      startDate: date,
      status: COMMON_STATUS.ACTIVE,
    },
  });

  // If doctorLeave is not found or is an empty array, set takenTimeSlotIds to an empty array
  timeslotIds = doctorLeave.map((leave) => leave.timeslotId);

  const takenTimeSlotIds = doctorLeave ? timeslotIds : [];

  // Find available time slots that are not in the takenTimeSlotIds array
  const availableSlots = await TimeSlot.findAll({
    attributes: ["id", "timeSlot"],
    where: {
      id: { [Op.notIn]: takenTimeSlotIds },
    },
  });

  return availableSlots;
};

module.exports = {
  changeDoctorLeaveStatus,
  checkIfLeaveExists,
  getAllLeaves,
  listLeaveById,
  deleteLeaveById,
  getTimeSlotsAvailability,
};
