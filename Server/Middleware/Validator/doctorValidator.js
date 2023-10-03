const { body, query } = require("express-validator");
const doctorValidator = (validationType) => {
  switch (validationType) {
    case "profileUpdate":
      return [
        body("name")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1030, message: "Name is required" })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1031,
            message: "Name cannot be greater than 50",
          })
          .matches(/^[A-Za-z0-9 ]+$/)
          .withMessage({
            errorCode: 1033,
            message: "Name must only contain alphanumeric characters",
          }),

        body("designation")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1166, message: "Designation is required" })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1165,
            message: "Designation cannot be greater than 50 characters",
          })
          .matches(/^[A-Za-z0-9 ]+$/)
          .withMessage({
            errorCode: 1164,
            message: "Designation must only contain alphanumeric characters",
          }),

        body("qualification")
          .trim()
          .notEmpty()
          .withMessage({
            errorCode: 1169,
            message: "Qualification is required",
          })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1168,
            message: "Qualification cannot be greater than 50 characters",
          })
          .matches(/^[A-Za-z0-9 ]+$/)
          .withMessage({
            errorCode: 1167,
            message: "Qualification must only contain alphanumeric characters",
          }),

        body("experience")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1170, message: "Experience is required" })
          .custom(async (value) => {
            if (!Number.isInteger(value) && value >= 0) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .withMessage({
            errorCode: 1171,
            message: "Experience must be a number greater than or equal to 0",
          }),

        body("version")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1240, message: "Version is required" })
          .custom(async (value) => {
            if (Number.isInteger(parseInt(value))) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .withMessage({
            errorCode: 1241,
            message: "Version must be a number",
          }),
      ];
    case "addDoctor":
      return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1002, message: "Email is required" })
        .isEmail()
        .withMessage({ errorCode: 1001, message: "Invalid Email" }),    
        body("name")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1030, message: "Name is required" })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1031,
            message: "Name cannot be greater than 50",
          })
          .matches(/^[A-Za-z0-9 ]+$/)
          .withMessage({
            errorCode: 1033,
            message: "Name must only contain alphanumeric characters",
          }),

        body("designation")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1166, message: "Designation is required" })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1165,
            message: "Designation cannot be greater than 50 characters",
          })
          .matches(/^[A-Za-z0-9 ]+$/)
          .withMessage({
            errorCode: 1164,
            message: "Designation must only contain alphanumeric characters",
          }),

        body("qualification")
          .trim()
          .notEmpty()
          .withMessage({
            errorCode: 1169,
            message: "Qualification is required",
          })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1168,
            message: "Qualification cannot be greater than 50 characters",
          })
          .matches(/^[A-Za-z0-9 ]+$/)
          .withMessage({
            errorCode: 1167,
            message: "Qualification must only contain alphanumeric characters",
          }),

        body("experience")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1170, message: "Experience is required" })
          .custom(async (value) => {
            if (!Number.isInteger(value) && value >= 0) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .withMessage({
            errorCode: 1171,
            message: "Experience must be a number greater than or equal to 0",
          }),
        
          body("specialtyId")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1223, message: "Speciality Id is required" })
          .custom(async (value) => {
            if (!Number.isInteger(value) && value >= 0) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .withMessage({
            errorCode: 1224,
            message: "Speciality Id must be a number greater than or equal to 0",
          }),
          body("subspecialtyId")
          .trim()
          .custom(async (value) => {
            if (!Number.isInteger(value) && value >= 0) {
              return Promise.resolve();
            } else {
              return Promise.reject();
            }
          })
          .withMessage({
            errorCode: 1226,
            message: "SubSpeciality Id must be a number greater than or equal to 0",
          }),
      ];
      case "editDoctor":
        return [   
          body("name")
            .trim()
            .notEmpty()
            .withMessage({ errorCode: 1030, message: "Name is required" })
            .isLength({ max: 50 })
            .withMessage({
              errorCode: 1031,
              message: "Name cannot be greater than 50",
            })
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage({
              errorCode: 1033,
              message: "Name must only contain alphanumeric characters",
            }),
  
          body("designation")
            .trim()
            .notEmpty()
            .withMessage({ errorCode: 1166, message: "Designation is required" })
            .isLength({ max: 50 })
            .withMessage({
              errorCode: 1165,
              message: "Designation cannot be greater than 50 characters",
            })
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage({
              errorCode: 1164,
              message: "Designation must only contain alphanumeric characters",
            }),
  
          body("qualification")
            .trim()
            .notEmpty()
            .withMessage({
              errorCode: 1169,
              message: "Qualification is required",
            })
            .isLength({ max: 50 })
            .withMessage({
              errorCode: 1168,
              message: "Qualification cannot be greater than 50 characters",
            })
            .matches(/^[A-Za-z0-9 ]+$/)
            .withMessage({
              errorCode: 1167,
              message: "Qualification must only contain alphanumeric characters",
            }),
  
          body("experience")
            .trim()
            .notEmpty()
            .withMessage({ errorCode: 1170, message: "Experience is required" })
            .custom(async (value) => {
              if (!Number.isInteger(value) && value >= 0) {
                return Promise.resolve();
              } else {
                return Promise.reject();
              }
            })
            .withMessage({
              errorCode: 1171,
              message: "Experience must be a number greater than or equal to 0",
            }),
          
            body("specialtyId")
            .trim()
            .notEmpty()
            .withMessage({ errorCode: 1223, message: "Speciality Id is required" })
            .custom(async (value) => {
              if (!Number.isInteger(value) && value >= 0) {
                return Promise.resolve();
              } else {
                return Promise.reject();
              }
            })
            .withMessage({
              errorCode: 1224,
              message: "Speciality Id must be a number greater than or equal to 0",
            }),
            body("subspecialtyId")
            .trim()
                      .custom(async (value) => {
              if (!Number.isInteger(value) && value >= 0) {
                return Promise.resolve();
              } else {
                return Promise.reject();
              }
            })
            .withMessage({
              errorCode: 1226,
              message: "SubSpeciality Id must be a number greater than or equal to 0",
            }),
        ];

    case "pagination":
      return [
        query("type")
          .optional()
          .isIn(["0", "1", "2"])
          .withMessage({ errorCode: 1175, message: "Type should be 0,1 or 2" }),

        query("id")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1270, message: "Id is required" })
          .isInt()
          .withMessage({ errorCode: 1271, message: "Id should be number" }),

        query("limit")
          .optional()
          .isInt({ min: 1 })
          .withMessage({
            errorCode: 1272,
            message: "Limit should be number greater than 0",
          }),

        query("page")
          .optional()
          .isInt({ min: 1 })
          .withMessage({
            errorCode: 1273,
            message: "Page should be number greater than 0",
          }),

        query("lastPageLastIndex")
          .trim()
          .custom((value, { req }) => {
            if (parseInt(req.query.page) > 1 && !value.trim()) {
              return Promise.reject({
                errorCode: 1274,
                message:
                  "Last page last index is required for page greater than 1",
              });
            } else {
              return Promise.resolve();
            }
          }),
      ];
      case "doctorpagination":
      return [
  

        query("limit")
          .optional()
          .isInt({ min: 1 })
          .withMessage({
            errorCode: 1272,
            message: "Limit should be number greater than 0",
          }),

        query("page")
          .optional()
          .isInt({ min: 1 })
          .withMessage({
            errorCode: 1273,
            message: "Page should be number greater than 0",
          }),
         
        

        
      ];

    case "addDiagnosticHistory":
      return [
        body("reason")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1225, message: "reason is required" })
          .isLength({ max: 50 })
          .withMessage({
            errorCode: 1227,
            message: "reason cannot be greater than 50 characters",
          })
          .isAlphanumeric()
          .withMessage({
            errorCode: 1229,
            message: "reason must only contain alphanumeric characters",
          }),

        body("prescription")
          .trim()
          .notEmpty()
          .withMessage({ errorCode: 1226, message: "prescription is required" })
          .isLength({ max: 300 })
          .withMessage({
            errorCode: 1228,
            message: "prescription cannot be greater than 300 characters",
          })
          .isAlphanumeric()
          .withMessage({
            errorCode: 1230,
            message: "prescription must only contain alphanumeric characters",
          }),
      ];
  }
};

module.exports = { doctorValidator };
