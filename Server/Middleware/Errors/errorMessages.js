const errorMap = {
  400: [
    { errorCode: 1007, message: "User not found" },
    { errorCode: 1260, message: "OTP verification failed! Incorrect OTP" },
    {
      errorCode: 1261,
      message: "OTP verification failed! OTP validity expired",
    },
    { errorCode: 1251, message: "Doctor unavailable" },
    { errorCode: 1003, message: "Incorrect password" },
    { errorCode: 1904, message: "VersionMismatch" },
    {
      errorCode: 1228,
      message:
        "Booking has been already cancelled ! Appointment cannot be cancelled / updated",
    },
    {
      errorCode: 1229,
      message:
        "Booking has been already rejected ! Appointment cannot be cancelled / updated",
    },
    { errorCode: 1155, message: "User already have package" },
    { errorCode: 1154, message: "Package validity Expired" },
    { errorCode: 1232, message: "Please select future time slots" },
    { errorCode: 1233, message: "Booking date has already passed" },

    {
      errorCode: 3001,
      message:
        "Requested time is not available for booking. Please choose a different time.",
    },
    {
      errorCode: 3010,
      message:
        "Diagnostic history can only be added on the booking date or in the Past.",
    },
    { errorCode: 3011, message: "Invalid booking or booking is not accepted." },
    {
      errorCode: 3013,
      message: "Diagnostic history already exists for this booking.",
    },
    {
      errorCode : 1121,
      message : "Facility already exists"
    },
    {
      errorCode : 1136,
      message : "Service already exists"
    },
    {
      errorCode : 1142,
      message : "Service already allocated to hospitals"
    },
    {
      errorCode : 1143,
      message : "Facility already allocated to hospitals"
    },
    {
      errorCode : 1156 ,
      message : "Hospital is not reside with this specialty"
    },
    {
      errorCode : 1157 ,
      message : "No hospital allocated for admin"
    },
    {
      errorCode : 1159,
      message : "Package is used by user"
    },
    {
      errorCode : 1280,
      message : "Minutes should be 00 or 30"
    },
    {
      errorCode : 1281 ,
      message : "Invalid time format"
    },
    {
      errorCode : 1282 ,
      message : "All times has been already added!Please select another range"
    },
    {
      errorCode : 3333 ,
      message : "Time slot is used by doctors.Cannot update"
    }
  ],
  404: [
    { errorCode: 1172, message: "DoctorId not found" },
    { errorCode: 1250, message: "Time slot not found" },
    { errorCode: 1230, message: "Patient not found" },
    { errorCode: 1220, message: "Booking Id not found" },
    { errorCode: 1152, message: "Package Id not found" },
    { errorCode: 1065, message: "Hospital Id not found" },
    { errorCode : 1110 , message : "Sub speciality Id not found"},
    { errorCode : 1090 , message : "Speciality Id not found"},
    { errorCode: 1190, message: "Blog not found" },
    { errorCode: 3005, message: "Booking not found or not modifiable." },
    { errorCode: 1125, message: "Facility id not found" },
    { errorCode: 1140, message: "Service id not found" },
    {errorCode : 1091,message : "Specialty not found"}


  ],
  403: [
    {
      errorCode: 1903,
      message: "Current user doesn’t have permission to perform this action",
    },
  ],
};

const formatError = (err, req, res, next) => {
  // Check if the error is a known error with a predefined status code and message
  if (errorMap[err.status]) {
    const foundError = errorMap[err.status].find(
      (errorObj) => errorObj.message === err.message
    );
    if (foundError) {
      const { errorCode, message } = foundError;
      return res.status(err.status).json({ errorCode, message });
    }
  }

  // If the error is not in the errorMap, default to 500 Internal Server Error
  res.status(500).json({ errorCode: 1905, message: "Internal Server Error" });
};

module.exports = {
  LEAVE_ALREADY_EXISTS: {
    errorcode: "30018",
    message:
      "Leave with the same type, date, and timeSlot ID already exists for the doctor.",
  },

  CUSTOM_LEAVE_EMPTY: {
    errorcode: "3015",
    message: "Please select at least one time slot for custom leave.",
  },
  INVALID_CUSTOM_LEAVE: {
    errorcode: "3020",
    message: "Invalid time slot selection for custom leave.",
  },
  INVALID_LEAVE_TYPE: { errorcode: "ERR004", message: "Invalid leave type." },

  BOOKING_NOT_FOUND: {
    errorCode: "3019",
    errorMessage: "Booking not found.",
  },
  TIME_NOT_AVAILABLE: {
    errorCode: "3009",
    errorMessage:
      "Requested time is not available for booking. Please choose a different time.",
  },
  formatError,
};
