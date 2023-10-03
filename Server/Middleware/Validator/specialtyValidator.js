const { body } = require("express-validator");

const specialtyValidator = (validationType) => {
  if (validationType === "addSpecialty") {
    return [
      body("specialtyName")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1079, message: "Speciality is required" })
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage({
          errorCode: 1077,
          message: "Speciality must only contain alphanumeric characters",
        })
        .isLength({ max: 50 })
        .withMessage({
          errorCode: 1078,
          message: "Speciality cannot be greater than 50",
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
    ];
  } else if (validationType === "addSubSpecialty") {
    return [
      body("specialtyId")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1210, message: "Specialty Id is required" })
        .custom(async (value) => {
          if (Number.isInteger(parseInt(value))) {
            return Promise.resolve();
          } else {
            return Promise.reject();
          }
        })
        .withMessage({
          errorCode: 1211,
          message: "Specialty Id should be a number",
        }),
      body("subSpecialtyName")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1103, message: "SubSpeciality is required" })
        .matches(/^[a-zA-Z0-9 ]+$/)
        .withMessage({
          errorCode: 1101,
          message: "SubSpeciality must only contain alphanumeric characters",
        })
        .isLength({ max: 50 })
        .withMessage({
          errorCode: 1102,
          message: "Speciality cannot be greater than 50",
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
    ];
  }
};

module.exports = {
  specialtyValidator,
};
