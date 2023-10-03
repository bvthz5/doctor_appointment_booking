const { body, query } = require('express-validator')
const { isValidDateFormat,isDateGreaterThanOrEqualToToday ,isDateLessThanOrEqualToToday} = require("./dateValidator")

const userValidator = (validationType) => {
    switch (validationType) {
        case 'addAdmin':
            return [
                body('name')
                .trim()
                .notEmpty()
                .withMessage({errorCode:1001, message:"Name is required"})
                .matches(/^[a-zA-Z0-9 ]+$/)
                .withMessage({errorCode : 1033 , message : "Name must only contain alphanumeric characters"})
                .isLength({ max: 50 })
                .withMessage({ errorCode: 1201, message: "Name cannot be greater than 50" }),

                body("email")
                .trim()
                .notEmpty()
                .withMessage({ errorCode: 1002, message: "Email is required" })
                .isEmail()
                .withMessage({ errorCode: 1001, message: "Invalid Email" }),

            ]
        case 'addUser':
            return [
                body('firstName')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1200, message: "Firstname is required" })
                    .matches(/^[a-zA-Z0-9]+$/)
                    .withMessage({errorCode : 1209 , message : "First name must only contain alphanumeric characters"})
                    .isLength({ max: 50 })
                    .withMessage({ errorCode: 1201, message: "Firstname cannot be greater than 50" }),

                body('lastName')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1202, message: "Lastname is required" })
                    .matches(/^[a-zA-Z0-9]+$/)
                    .withMessage({errorCode : 1204 , message : "Last name must only contain alphanumeric characters"})
                    .isLength({ max: 50 })
                    .withMessage({ errorCode: 1203, message: "Lastname cannot be greater than 50" }),

                body('dob')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1206, message: "DOB is required" })
                    .custom(async (value) => {
                        if (!isValidDateFormat(value)) {
                            return Promise.reject({ errorCode: 1205, message: "Invalid DOB" });
                        }
                          
                        if (!isDateLessThanOrEqualToToday(value)) {
                        return Promise.reject({ errorCode: 1024, message: "DOB should be less than current date" });
                        }
                      
                    }),

                body('gender')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1208, message: "Gender is required" })
                    .isIn(["male", "female", "other"])
                    .withMessage({ errorCode: 1207, message: "Invalid Gender" }),

                body('mobileNo')
                    .isLength({ max: 10 })
                    .withMessage({ errorCode: 1053, message: "MobileNo should not be greater than 10" })

            ]

        case 'otpVerification':
            return [
                body('email')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1002, message: "Email is required" })
                    .isEmail()
                    .withMessage({ errorCode: 1001, message: "Invalid Email" }),

                body('otp')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1008, message: "OTP is required" })
            ]

        case 'addBooking':
            return [
                body('doctorId')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1210, message: "Doctor Id is required" })
                    .custom(async (value) => {
                        if (Number.isInteger(parseInt(value))) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject()
                        }
                    })
                    .withMessage({ errorCode: 1211, message: "Doctor Id should be a number" }),

                body('date')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1212, message: "Date is required" })
                    .custom(async (value) => {
                        if (!isValidDateFormat(value)) {
                            return Promise.reject({ errorCode: 1213, message: "Invalid Date" });
                          }
                      
                          if (!isDateGreaterThanOrEqualToToday(value)) {
                            return Promise.reject({ errorCode: 1214, message: "Date should be greater than or equalto current date" });
                          }
                      
                    }),

                body('slot')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1215, message: "Slot is required" })
                    .custom(async (value) => {
                        if (Number.isInteger(parseInt(value))) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject()
                        }
                    })
                    .withMessage({ errorCode: 1216, message: "Slot should be a number" }),

                body('amount')
                    .trim()
                    .notEmpty()
                    .withMessage({ errorCode: 1218, message: "Amount is required" })
                    .custom(async (value) => {
                        if (Number.isInteger(parseInt(value))) {
                            return Promise.resolve()
                        } else {
                            return Promise.reject()
                        }
                    })
                    .withMessage({ errorCode: 1217, message: "Amount should be a number" })

            ]

            case 'addEmail':
                return[
                    body('email')
                        .trim()
                        .notEmpty()
                        .withMessage({ errorCode: 1002, message: "Email is required" })
                        .isEmail()
                        .withMessage({ errorCode: 1001, message: "Invalid Email" })
                ]
                
            case 'updateBooking':
                return [
                    body('doctorId')
                        .trim()
                        .notEmpty()
                        .withMessage({ errorCode: 1210, message: "Doctor Id is required" })
                        .custom(async (value) => {
                            if (Number.isInteger(parseInt(value))) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject()
                            }
                        })
                        .withMessage({ errorCode: 1211, message: "Doctor Id should be a number" }),
    
                    body('date')
                        .trim()
                        .notEmpty()
                        .withMessage({ errorCode: 1212, message: "Date is required" })
                        .custom(async (value) => {
                            if (!isValidDateFormat(value)) {
                                return Promise.reject({ errorCode: 1213, message: "Invalid Date" });
                                }
                            
                                if (!isDateGreaterThanOrEqualToToday(value)) {
                                return Promise.reject({ errorCode: 1214, message: "Date should be greater than or equalto current date" });
                                }
                            
                        }),
    
                    body('slot')
                        .trim()
                        .notEmpty()
                        .withMessage({ errorCode: 1215, message: "Slot is required" })
                        .custom(async (value) => {
                            if (Number.isInteger(parseInt(value))) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject()
                            }
                        })
                        .withMessage({ errorCode: 1216, message: "Slot should be a number" })
    
                ]

            case 'availableSlots':
                return[
                    query('doctorId')
                        .trim()
                        .notEmpty()
                        .withMessage({ errorCode: 1210, message: "Doctor Id is required" })
                        .custom(async (value) => {
                            if (Number.isInteger(parseInt(value))) {
                                return Promise.resolve()
                            } else {
                                return Promise.reject()
                            }
                        })
                        .withMessage({ errorCode: 1211, message: "Doctor Id should be a number" }),

                    query('date')
                        .trim()
                        .notEmpty()
                        .withMessage({ errorCode: 1212, message: "Date is required" })
                        .custom(async (value) => {
                            if (!isValidDateFormat(value)) {
                                return Promise.reject({ errorCode: 1213, message: "Invalid Date" });
                                }
                                if (!isDateGreaterThanOrEqualToToday(value)) {
                                return Promise.reject({ errorCode: 1214, message: "Date should be greater than or equalto current date" });
                                }
                        
                        })

                    ]

                    case 'paginationHandler':
                        return[

                            query('limit')
                                .optional()
                                .isInt({min : 1})
                                .withMessage({errorCode : 1272 , message : "Limit should be number greater than 0"}),
            
                            query('page')
                                .optional()
                                .isInt({min : 1})
                                .withMessage({errorCode : 1273 , message : "Page should be number greater than 0"}),
            

                        ]
    }
}

module.exports = {
    userValidator
}