const { body, query } = require("express-validator");
const moment = require('moment')

const bookingValidator = (validationType) => {
  switch (validationType) {
    case "viewBooking": {
      return [
        query("type").isIn(["0", "1", "2", "3", "4", "5", "6"]).withMessage({
          errorCode: 1195,
          message: "Type should be 0,1,2,3,4,5,6",
        }),
      ];
    }
  }
};

module.exports ={bookingValidator}