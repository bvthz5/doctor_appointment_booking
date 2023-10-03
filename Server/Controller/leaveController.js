const { validationResult } = require("express-validator");
const { tryCatch } = require("../Middleware/Errors/tryCatch");
const logger = require("../logger");
const { changeDoctorLeaveStatus, getAllLeaves, listLeaveById, deleteLeaveById, getTimeSlotsAvailability } = require("../Service/leaveService");


/**
 * Change the leave status for a doctor.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response object with success message or error message.
 */
const changeLeaveStatus = tryCatch(async (req, res) => {

  const doctorId = req.user.id;
  const { startDate, endDate, type, timeSlotIds } = req.body;

 
  const results = await changeDoctorLeaveStatus(
    doctorId,
    startDate,
    endDate,
    type,
    timeSlotIds
  );


  if (results.errorcode) {
    return res.status(400).json({errorCode:results.errorcode, message: results.message });

  } else {
    return res.status(200).json({ message: "Leave updated successfully" });
  }
});


/**
 * List all leave records with pagination.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const listAllLeaves = tryCatch(async (req, res) => {
 


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const searchParams = {
      startDate: req.query.startDate || null,
      endDate: req.query.endDate || null,
      doctorName: req.query.doctorName || null,
    };  

    const { leaves, totalRecords, hasPrevious } = await getAllLeaves(
      page,
      limit,
      searchParams
    );

    // Calculate the total number of pages and whether there's a next page available
    const totalPages = Math.ceil(totalRecords / limit);
    const hasNext = page < totalPages;

    const response = {
      Items: leaves,
      Count: totalRecords,
      currentPage: page,
      TotalPages: totalPages,
      HasNext: hasNext,
      HasPrevious: hasPrevious,
    };

    res.status(200).json(response);
    logger.info("Leaves Listed");
 
});


/**
 * Delete a leave record by ID.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const DeleteLeave =  tryCatch(async(req,res)=>{


  const leaveId = req.params.id;

  const removeLeave = await listLeaveById(leaveId, req.user.id);
  if (!removeLeave) {
    logger.warn(`Leave not found for ID: ${leaveId}`);
    return res
      .status(404)
      .json({ errorCode: "1190", message: "Leave Not Found" });
  } else {
    await deleteLeaveById(leaveId);
    logger.info(`Leave deleted successfully for ID: ${leaveId}`);
    return res.status(200).json({ message: "Blog Deleted Successfully" });
  }
})


/**
 * List available time slots for a doctor on a specific date.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const listAvailableTimeSlots = tryCatch(async(req, res )=>{
  const doctorId = req.user.id;
  const date = req.query.date;
  const availableSlots = await getTimeSlotsAvailability(doctorId, date);
  res.status(200).json(availableSlots)
})

module.exports = {
  changeLeaveStatus,
  listAllLeaves,
  DeleteLeave,
  listAvailableTimeSlots
};
