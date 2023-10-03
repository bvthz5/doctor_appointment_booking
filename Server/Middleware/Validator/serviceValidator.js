const { body } = require("express-validator");

const serviceValidator = (validationType) => {
  if (validationType === "addService") {
    return [
      body("serviceName")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1124, message: "Service is required" })
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage({
          errorCode: 1122,
          message: "Service must only contain alphanumeric characters",
        })
        .isLength({ max: 50 })
        .withMessage({
          errorCode: 1123,
          message: "Service cannot be greater than 50",
        }),

      body("description")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1080, message: "Description is required" })
        .isLength({ max: 200 })
        .withMessage({
          errorCode: 1081,
          message: "Description cannot be greater than 200",
        }),
    ]
  }
};

module.exports = {
    serviceValidator,
};
