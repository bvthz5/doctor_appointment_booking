const { body } = require("express-validator");
const {
  isValidDateFormat,
  isGreaterThanToday,
} = require("./dateValidator");
const validateIdMiddleware = (req, res, next) => {
  const id = req.params.id;

  if (!Number.isInteger(parseInt(id))) {
    return res.status(400).json({
      errorCode: "1140",
      message: "Invalid ID. Please provide a valid ID.",
    });
  }

  // If the id is valid, move to the next middleware/controller
  next();
};

const packageValidator = (validationType) => {
  if (validationType == "addPackage") {
    return [
      body("packageId")
        .notEmpty()
        .withMessage({ errorCode: 1153, message: "PackageId is required" })
        .custom((value) => {
          if (typeof value === "number" && value > 0) {
            return Promise.resolve();
          } else {
            return Promise.reject({
              errorCode: 1154,
              message: "PackageId must be number greater than 0",
            });
          }
        }),
    ];
  } else if (validationType === "addNew") {
    return [
      body("name")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1030, message: "Name is required" })
        .matches(/^[A-Za-z0-9 ]+$/)
        .withMessage({
          errorCode: 1050,
          message: "Name must contain only alphanumeric characters",
        })
        .isLength({ max: 50 })
        .withMessage({
          errorCode: 1051,
          message: "Name cannot be greater than 50 characters",
        }),

      body("price")
        .notEmpty()
        .withMessage({ errorCode: 1150, message: "Price is required" })
        .isInt()
        .withMessage({ errorCode: 1151, message: "Price should be a number" }),

      body("offer")
        .notEmpty()
        .withMessage({ errorCode: 1080, message: "Offer is required" })
        .isFloat({min : 1,max:99.99})
        .withMessage({ errorCode: 1081, message: "off should be a number between 1 and 100" }),

      body("validity")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1083, message: "Validity is required" })
        .custom(async (value) => {
          if (!isValidDateFormat(value)) {
            return Promise.reject({
              errorCode: 1084,
              message: "Validity should be in valid date format",
            });
          }

          if (!isGreaterThanToday(value)) {
            return Promise.reject({
              errorCode: 1085,
              message:
                "Validity should be a greater than current date",
            });
          }
        }),
    ];
  }
};

module.exports = {
  validateIdMiddleware,
  packageValidator,
};
