const TimeSlot = require("../Model/timeSlotModel");
const { createCustomError } = require("../Middleware/Errors/errorHandler");
const { COMMON_STATUS } = require("../Util/constants");
const HospitalTime = require("../Model/hospitalTimeModel");
const { timeSlot, doctorTimeSlotList } = require("../Middleware/Views/formatResponse");
const DoctorTime = require("../Model/doctorTimeModel");
const Doctor = require("../Model/doctorModel");
const Hospital = require("../Model/hospitalModel");
const sequelize = require("../database");

/**
 * Retrieves a time slot by slot ID.
 *
 * @function
 * @async
 * @param {number} slotId - The ID of the time slot to retrieve.
 * @returns {Promise<Object>} - A Promise that resolves to the retrieved time slot object.
 * @throws {CustomError} - Throws a custom error if the time slot is not found.
 */
const getById = async (slotId) => {
  const slot = await TimeSlot.findByPk(slotId);
  if (!slot) {
    // Create custom error
    const error = createCustomError("Time slot not found", 404);
    throw error;
  }
  return slot;
};

const timeSlotList = async (page, limit) => {
  const timeSlot = await TimeSlot.findAndCountAll({
    where: { status: COMMON_STATUS.ACTIVE },
    order: [["createdAt", "DESC"]],
    limit: limit,
    offset: (page - 1) * limit,
  });
  return {
    items: timeSlot.rows,
    count: timeSlot.count,
  };
};

const addTimes = async (data) => {
  await TimeSlot.bulkCreate(data);
};

const getTimeSlot = async (timesAdded) => {
  const slots = await TimeSlot.findAll({
    where: { status: COMMON_STATUS.ACTIVE },
    attributes: ["timeSlot"],
  });
  const timeSlotsArray = slots.map((slot) => slot.timeSlot);
  let timesArray;
  if (timeSlotsArray.length != 0) {
    let newTimes = timesAdded;
    const array1WithoutSeconds = timeSlotsArray.map((time) =>
      time.split(":").slice(0, 2).join(":")
    );

    timesArray = newTimes.filter(
      (time) => !array1WithoutSeconds.includes(time)
    );
  }

  return timesArray;
};

const hospitalSlots = async (hospitalId) => {
  let allTimeslots;
  const timeSlots = await HospitalTime.findAll({
    where: { hospitalId: hospitalId, status: COMMON_STATUS.ACTIVE },
    attributes: ["timeslotId"],
    include: [{ model: TimeSlot }],
  });
  if (timeSlots.length == 0) {
    allTimeslots = await TimeSlot.findAll({
      where: { status: COMMON_STATUS.ACTIVE },
      attributes: ["id", "timeSlot"],
    });
  } else {
    allTimeslots = timeSlot(timeSlots);
  }
  return allTimeslots;
};

const validateIds = async (timeSlotIds) => {
  const existingTimeSlots = await TimeSlot.findAll({
    where: {
      id: timeSlotIds, // Check if the IDs match the provided IDs
    },
  });
  // Extract the IDs of the existing TimeSlots
  const existingIds = existingTimeSlots.map((timeSlot) => timeSlot.id);

  // Find the IDs that are missing from the existing TimeSlots
  const missingIds = timeSlotIds.filter((id) => !existingIds.includes(id));

  if (missingIds.length > 0) {
    // Create custom error
    const error = createCustomError("Time slot not found", 404);
    throw error;
  }
};

const addHsplTimeSlot = async (hospitalId, times) => {
  const hospitalSlots = await HospitalTime.findAll({
    where: { status: COMMON_STATUS.ACTIVE, hospitalId: hospitalId },
  });
  const existingHospitalTimes = hospitalSlots.map((slot) => slot.timeslotId);

  const newSlotsAdded = times.filter(
    (id) => !existingHospitalTimes.includes(id)
  );

  const slotsToRemove = existingHospitalTimes.filter(
    (id) => !times.includes(id)
  );

  //get all doctors from the hospital
  const doctors = await Doctor.findAll({
    where: { hospitalId: hospitalId, status: COMMON_STATUS.ACTIVE },
  });
  const doctorIds = doctors.map((doctor) => doctor.id);

  //check if any doctor has these timeslots
  const doctorSlots = await DoctorTime.findAll({
    where: {
      timeslotId: slotsToRemove,
      doctorId: doctorIds,
      status: COMMON_STATUS.ACTIVE,
    },
    include: [{ model: Doctor, where: { status: COMMON_STATUS.ACTIVE } }],
  });

  if (doctorSlots.length != 0) {
    // Create custom error
    const error = createCustomError(
      "Time slot is used by doctors.Cannot update",
      400
    );
    throw error;
  }

  await HospitalTime.update(
    { status: COMMON_STATUS.INACTIVE },
    { where: { timeslotId: slotsToRemove } }
  );
  const data = newSlotsAdded.map((timeslotId) => ({
    timeslotId,
    hospitalId,
    status: 1,
  }));
  await HospitalTime.bulkCreate(data);
};

const getdoctorSlots = async () => {
  const slots = await DoctorTime.findAll({
    where: { status: COMMON_STATUS.ACTIVE },
    order : [['createdAt','DESC']],
    include: [
      {
        model: TimeSlot,
        attributes: ["id", "timeSlot"],
      },
      {
        model: Doctor,
        attributes: ["id", "name"],
        where : {status : COMMON_STATUS.ACTIVE},
        include: [
          {
            model: Hospital,
            attributes: ["id", "name"],
          },
        ],
      },
    ],
  });

  const response = doctorTimeSlotList(slots)
  return response;
};

module.exports = {
  getById,
  timeSlotList,
  addTimes,
  getTimeSlot,
  hospitalSlots,
  addHsplTimeSlot,
  validateIds,
  getdoctorSlots,
};
