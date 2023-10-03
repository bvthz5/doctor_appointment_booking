const { body } = require("express-validator");

const hospitalValidator = (validationType) => {
  switch (validationType) {
    case "addHospital":
      return [
        body("email")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1002, message: "Email is required" })
          .isEmail()
          .withMessage({ errorCode: 1001, message: "Invalid Email" }),
        body("adminId")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1210, message: "Admin Id is required" })
          .custom(async (value) => {
            if (Number.isInteger(parseInt(value))) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .withMessage({
            errorCode: 1211,
            message: "Admin Id should be a number",
          }),
        body("name")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1001, message: "Name is required" })
          .matches(/^[a-zA-Z0-9 ]+$/)
          .withMessage({
            errorCode: 1033,
            message: "Name must only contain alphanumeric characters",
          })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1201,
            message: "Name cannot be greater than 50",
          }),
        body("city")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1001, message: "Name is required" })
          .matches(/^[a-zA-Z0-9 ]+$/)
          .withMessage({
            errorCode: 1054,
            message: "City must contain only alphanumeric characters",
          })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1055,
            message: "City cannot be greater than 50 characters",
          }),
        body("contactNo")
          .trim()
          .custom(async (value) => {
            if (Number.isInteger(parseInt(value))) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .withMessage({
            errorCode: 1211,
            message: "Admin Id should be a number",
          })
          .isLength({ max: 10 })
          .withMessage({
            errorCode: 1059,
            message: "Conatact number cannot be greater than 10 digits",
          }).
          body("address")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1056, message: "Address is required" })
          .matches(/^[a-zA-Z0-9 ]+$/)
          .withMessage({
            errorCode: 1059,
            message: "Address must contain only alphanumeric characters",
          })
          .isLength({ max: 200 })
          .withMessage({
            errorCode: 1111,
            message: "Address cannot be greater than 200 characters",
          }),
          body('speciality')
          .isArray({ min: 1 })
          .withMessage({ errorCode: 1058, message: "Speciality is required" })
          .custom((specialities) => {
            // Custom validation for the speciality array
            for (const speciality of specialities) {
              if (!speciality.specialityId || !Number.isInteger(speciality.specialityId) || speciality.specialityId <= 0) {
                throw new Error('Invalid specialityId');
              }
      
              if (!speciality.subspecialities || !Array.isArray(speciality.subspecialities)) {
                throw new Error('subspecialities must be an array');
              }
      
              for (const subspeciality of speciality.subspecialities) {
                if (!Number.isInteger(subspeciality) || subspeciality <= 0) {
                  throw new Error('Invalid subspeciality value');
                }
              }
            }
      
            return true;
          }),
      ];
  }
};


module.exports= {
    hospitalValidator
}
