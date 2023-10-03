const { body } = require("express-validator");
const { createCustomError } = require("../Errors/errorHandler");

const timeValidator = (validationType) => {
  if (validationType === "addTime") {
    return [
      body("startTime")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 8888, message: "Start time is required" })
        .custom((value) => {
          const error = validateTimeFormat(value);
          console.log(error);
          if (error === "Invalid time format") {
            return Promise.reject({
              errorCode: 1283,
              message: error,
            });
          } else if (error === "Minutes should be 00 or 30") {
            return Promise.reject({
              errorCode: 1284,
              message: error,
            });
          } else {
            return Promise.resolve();
          }
        }),

      body("endTime")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 7777, message: "End time is required" })
        .custom((value, { req }) => {
          const error = validateTimeFormat(value);
          console.log(error);
          if (error === "Invalid time format") {
            return Promise.reject({
              errorCode: 1283,
              message: error,
            });
          } else if (error === "Minutes should be 00 or 30") {
            return Promise.reject({
              errorCode: 1284,
              message: error,
            });
          } else {
            if (!isTimeGreaterThan(req.body.startTime, value)) {
              return Promise.reject({
                errorCode: 1285,
                message: "End time must be greater than start time",
              });
            }
            return Promise.resolve();
          }
        }),
    ];
  } else if ("hospitalTimeSlots") {
    return [
      body("timeSlots")
        .isArray()
        .withMessage({
          errorCode: 1286,
          message: "Hospital time slots should be in an array",
        }),        
    ];
  }
};

const validateTimeFormat = (value) => {
  const timeParts = value?.split(":");
  if (
    timeParts?.length === 2 &&
    parseInt(timeParts?.[1]) < 60 &&
    parseInt(timeParts?.[0]) > 1 &&
    parseInt(timeParts?.[0]) < 23
  ) {
    const minutes = parseInt(timeParts[1]);
    if (minutes !== 0 && minutes !== 30) {
      return "Minutes should be 00 or 30";
    }
  } else {
    return "Invalid time format";
  }
  return true;
};

const isTimeGreaterThan = (startTime, endTime) => {
  const [startHours, startMinutes] = startTime.split(":");
  const [endHours, endMinutes] = endTime.split(":");

  const startTimestamp = parseInt(startHours) * 60 + parseInt(startMinutes);
  const endTimestamp = parseInt(endHours) * 60 + parseInt(endMinutes);

  return endTimestamp > startTimestamp;
};

module.exports = {
  timeValidator,
};
