const { body, query } = require("express-validator");
const moment = require("moment");

const leaveValidator = (validationType) => {
  switch (validationType) {
    case "leave":
      return [
        body("startDate")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1212, message: "Start date is required" })
          .custom(async (value) => {
            const validFormats = ["YYYY-MM-DD", "MM-DD-YYYY"];
            if (!moment(value, validFormats, true).isValid()) {
              return Promise.reject({
                errorCode: 1213,
                message: "Invalid start date",
              });
            }

            if (!moment(value, validFormats).isSameOrAfter(moment(), "day")) {
              return Promise.reject({
                errorCode: 1214,
                message:
                  "Start date should be greater than or equal to current date",
              });
            }
          }),

        body("endDate")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1312, message: "End date is required" })
          .custom(async (value, { req }) => {
            const validFormats = ["YYYY-MM-DD", "MM-DD-YYYY"];
            if (!moment(value, validFormats, true).isValid()) {
              return Promise.reject({
                errorCode: 1313,
                message: "Invalid end date",
              });
            }

            if (
              !moment(value, validFormats).isSameOrAfter(
                req.body.startDate,
                "day"
              )
            ) {
              return Promise.reject({
                errorCode: 1314,
                message:
                  "End date should be greater than or equal to start date",
              });
            }
          }),

        body("type").isIn(["0", "1", "2", "3"]).withMessage({
          errorCode: 1412,
          message: "Type should be 0, 1,  2 , or 3",
        }),
      ]

      case 'AvailableTimeSlots':
        return[
          query("date")
          .trim()
          .notEmpty().withMessage("Date is required")
          .custom(value => {
            const validFormats = ["YYYY-MM-DD", "MM-DD-YYYY"];
            if (!moment(value, validFormats, true).isValid()) {
              throw new Error("Invalid date format");
            }
            return true;
          }),
        ]
  }
};

module.exports = { leaveValidator };
