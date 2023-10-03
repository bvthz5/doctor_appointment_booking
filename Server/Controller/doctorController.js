const doctorService = require("../Service/doctorService");
const packageService = require("../Service/packageService");
const bcrypt = require("bcrypt");
const logger = require("../logger");
const { tryCatch } = require("../Middleware/Errors/tryCatch");
const { validationResult } = require("express-validator");
const tokenGeneration = require("../Util/auth");
const { DOCTORSLIST, COMMON_STATUS } = require("../Util/constants");
const {
  getSpecialtyHospitalByHospitalSpecialtySubSpeciality,
  getHospitalByAdminIdandHospId,
  getHospitalByAdminId,
} = require("../Service/hospitalService");
const { sendGeneratedPassword } = require("../Util/mail");
const jwt = require("jsonwebtoken");

/**
 * Handles the doctor login process.
 *
 * @function
 * @async
 * @param {Object} req - Express request object containing the doctor's credentials.
 * @param {Object} res - Express response object to send the response.
 * @param {Function} next - The next middleware function.
 */
const doctorLogin = async (req, res, next) => {
  try {
    //check if user exists or not
    const user = await doctorService.doctorLogin(req.body);

    //compare password in database and requested password
    const match = await bcrypt.compare(
      req.body.password,
      user.dataValues.password
    );
    if (match) {
      const { accessTokenSign, refreshTokenSign } =
        await tokenGeneration.generateTokenValues(user.dataValues, "DOCTOR");

      delete user.dataValues.password;
      res.send({
        accessToken: accessTokenSign,
        refreshToken: refreshTokenSign,
        userDetails: user.dataValues,
      });
    } else {
      res.status(400).send({ errorCode: 1003, message: "Incorrect password" });
    }
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Get details of the authenticated doctor.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const doctorDetails = async (req, res, next) => {
  try {
    //get details by id from token
    const user = await doctorService.getById(req.user.id);
    res.send(user);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Update doctor's profile information.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const updateProfile = async (req, res, next) => {
  try {
    //get doctor details by id
    const user = await doctorService.getById(
      req.user.id,
      req.body.version,
      req.file
    );

    const data = req.body;
    if (req?.file?.key) {
      data.imageKey = req.file.key;
    }
    data.version = parseInt(user.dataValues.version) + 1;
    await doctorService.profileUpdate(data, req.user);
    res.send({ message: "Successfully updated" });
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

const addDoctor = async (req, res, next) => {
  try {
    //get doctor details by email
    const user = await doctorService.userExists(req?.body?.email);
    if (user) {
      return res
        .status(400)
        .send({ errorCode: 1032, message: "Email already exists" });
    } else {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      let hospitalId;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
        if (decoded?.role === "SUPERADMIN") {
          hospitalId = req.body.hospitalId;
        } else if (decoded?.role === "ADMIN") {
          const hospital = await getHospitalByAdminId(decoded?.id);
          if (!hospital) {
            return res.status(400).send({
              errorCode: 1230,
              message: "Hospital not allocated to admin",
            });
          } else {
            hospitalId = hospital.dataValues?.id;
          }
        }
        const specilityHospital =
          await getSpecialtyHospitalByHospitalSpecialtySubSpeciality(
            hospitalId,
            req.body.specialtyId,
            req.body.subspecialtyId
          );
        console.log(specilityHospital);
        if (!specilityHospital) {
          return res.status(400).send({
            errorCode: 1231,
            message:
              "Speciality/SubSpeciality is not associated with the provided hospital",
          });
        } else {
          const data = req.body;
          if (req?.file?.key) {
            data.imageKey = req.file.key;
          }
          const password = await tokenGeneration.generatePassword();
          const passwordHash = await bcrypt.hash(password, 10);
          data.password = passwordHash;
          data.version = 1;
          data.hospitalId =hospitalId;
          data.subspecialtyId =
            req.body.subspecialtyId === "" || !req.body.subspecialtyId
              ? null
              : req.body.subspecialtyId;
          data.status = COMMON_STATUS.ACTIVE;
          await doctorService.doctorAdd(data);
          sendGeneratedPassword(req?.body?.email, password);
          res.send({ message: "Doctor added successfully" });
        }
      } else {
        return res.status(403).send({
          errorCode: 403,
          message: "Access denied",
        });
      }
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Function to edit doctor details by admin or Super admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const editDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.id;
    const doctor = await doctorService.doctorView(doctorId);
    if (!doctor) {
      return res.status(404).send({
        errorCode: 1172,
        message: "doctor id not found",
      });
    } else {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      let hospitalId;
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
        if (decoded?.role === "SUPERADMIN") {
          hospitalId = req.body.hospitalId;
        } else if (decoded?.role === "ADMIN") {
          const hospital = await getHospitalByAdminId(decoded?.id);
          /** Condition to check the user have the permission to edit given user */
          if (!hospital) {
            return res.status(400).send({
              errorCode: 1230,
              message: "Hospital not allocated to admin",
            });
          } else if (
            hospital.dataValues?.id !== doctor?.dataValues?.hospitalId
          ) {
            return res.status(403).send({
              errorCode: 403,
              message: "Access denied",
            });
          } else {
            hospitalId = hospital.dataValues?.id;
          }
        }
        const specilityHospital =
          await getSpecialtyHospitalByHospitalSpecialtySubSpeciality(
            hospitalId,
            req.body.specialtyId,
            req.body.subspecialtyId
          );
        if (!specilityHospital) {
          return res.status(400).send({
            errorCode: 1231,
            message:
              "Speciality/SubSpeciality is not associated with the provided hospital",
          });
        } else {
          const data = req.body;
          if (req?.file?.key) {
            data.imageKey = req.file.key;
          }
          data.subspecialtyId =
            req.body.subspecialtyId === "" || !req.body.subspecialtyId
              ? null
              : req.body.subspecialtyId;
          data.version = parseInt(doctor.dataValues.version) + 1;
          await doctorService.editDoctor(data, doctorId);
          res.send({ message: "Doctor edited successfully" });
        }
      } else {
        return res.status(403).send({
          errorCode: 403,
          message: "Access denied",
        });
      }
    }
  } catch (err) {
    console.log(err);
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Get a list of doctors based on provided parameters.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const getAllDoctors = async (req, res, next) => {
  try {
    const id = req.query.id;
    const type = parseInt(req.query.type) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const search = req.query.search;
    const lastPageLastIndex = page === 1 ? null : req.query.lastPageLastIndex;

    if (type === DOCTORSLIST.SUBSPECIALTY_WISE) {
      //check whether the subspecialty id is valid
      await doctorService.getSubSpecialtyId(id);
    } else if (type === DOCTORSLIST.SPECIALTY_WISE) {
      //checks the specialty id is valid
      await doctorService.getSpecialty(id);
    } else {
      //checks the hospital id is valid
      await packageService.getHospitalId(id);
    }

    const { items, count } = await doctorService.doctorList(
      id,
      type,
      limit,
      page,
      search,
      lastPageLastIndex
    );

    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const response = {
      items,
      count,
      hasNext,
      currentPage: page,
      totalPages,
    };

    res.send(response);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

const getDoctorsList = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    let hospitalId = [];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
      if (decoded?.role === "SUPERADMIN") {
        if (req.query.id) {
          hospitalId = req?.query?.id?.split(",").map(Number);
        }
      } else if (decoded?.role === "ADMIN") {
        const hospital = await getHospitalByAdminId(decoded?.id);
        if (!hospital) {
          return res.status(400).send({
            errorCode: 1230,
            message: "Hospital not allocated to admin",
          });
        } else {
          hospitalId = [hospital.dataValues?.id];
        }
      }

      const limit = parseInt(req.query.limit) || 10;
      const page = parseInt(req.query.page) || 1;
      const search = req.query.search;
      let specialtyId = [];
      let subSpecialityId = [];
      if (req?.query?.specialtyId) {
        specialtyId = req?.query?.specialtyId?.split(",").map(Number);
      }
      if (req?.query?.subspecialtyId) {
        console.log("containsss");
        subSpecialityId = req?.query?.subspecialtyId?.split(",").map(Number);
      }
      const { items, count } = await doctorService.getAllDoctorsList(
        hospitalId,
        limit,
        page,
        search,
        specialtyId,
        subSpecialityId
      );

      const totalPages = Math.ceil(count / limit);
      const hasNext = page < totalPages;
      const response = {
        items,
        count,
        hasNext,
        currentPage: page,
        totalPages,
      };
      res.send(response);
    } else {
      return res.status(403).send({
        errorCode: 403,
        message: "Access denied",
      });
    }
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Get details of a specific doctor.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing parameters.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const doctorView = async (req, res, next) => {
  try {
    //check if the doctor id present or not
    const doctor = await doctorService.doctorView(req.params.id);
    res.send(doctor.dataValues);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Add diagnostic history for a patient.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const addDiagnosticHistory = tryCatch(async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    logger.warn("Validation errors", errors.array());
    res.status(400).json({ errors: errors.array() });
  }

  const loggedInDoctor = req.user;
  const data = req.body;

  const createdHistory = await doctorService.DiagnosticHistory(
    data,
    loggedInDoctor
  );
  res
    .status(201)
    .json({ message: "History added successfully", history: createdHistory });
  logger.info("History added successfully");
});

/**
 * Retrieve a list of best doctors based on criteria.
 *
 * @function
 * @async
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const doctorsList = async (req, res) => {
  try {
    const doctors = await doctorService.bestDoctors(req);

    res.send(doctors);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    res
      .status(500)
      .send({ errorCode: 1905, message: "An unexpected error occured" });
  }
};

const getDoctorDetails = async (req, res, next) => {
  try {
    //check if the doctor id present or not
    const doctorId = req.params.id;
    const doctor = await doctorService.doctorView(doctorId);
    if (!doctor) {
      return res.status(404).send({
        errorCode: 1172,
        message: "doctor id not found",
      });
    } else {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
        if (decoded?.role === "ADMIN") {
          const hospital = await getHospitalByAdminId(decoded?.id);
          if (!hospital) {
            return res.status(400).send({
              errorCode: 1230,
              message: "Hospital not allocated to admin",
            });
          } else if (
            hospital.dataValues?.id !== doctor?.dataValues?.hospitalId
          ) {
            return res.status(403).send({
              errorCode: 403,
              message: "Access denied",
            });
          }
        }

        res.send(doctor.dataValues);
      } else {
        return res.status(403).send({
          errorCode: 403,
          message: "Access denied",
        });
      }
    }
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Function to delete doctor by superadmin or admin of the specific hospital
 * @param {*} req - http request
 * @param {*} res - http response
 * @param {*} next
 * @returns
 */

const deleteDoctor = async (req, res, next) => {
  try {
    //check if the doctor id present or not
    const doctorId = req.params.id;
    const doctor = await doctorService.doctorView(doctorId);
    if (!doctor) {
      return res.status(404).send({
        errorCode: 1172,
        message: "doctor id not found",
      });
    } else {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
        if (decoded?.role === "ADMIN") {
          const hospital = await getHospitalByAdminId(decoded?.id);
          if (!hospital) {
            return res.status(400).send({
              errorCode: 1230,
              message: "Hospital not allocated to admin",
            });
          } else if (
            hospital.dataValues?.id !== doctor?.dataValues?.hospitalId
          ) {
            return res.status(403).send({
              errorCode: 403,
              message: "Access denied",
            });
          }
        }
        await doctorService.doctorDelete(doctorId);
        res.send({ message: "Doctor deleted successfully" });
      } else {
        return res.status(403).send({
          errorCode: 403,
          message: "Access denied",
        });
      }
    }
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

module.exports = {
  getDoctorsList,
  deleteDoctor,
  getDoctorDetails,
  editDoctor,
  addDoctor,
  doctorLogin,
  doctorDetails,
  updateProfile,
  getAllDoctors,
  doctorView,
  addDiagnosticHistory,
  doctorsList,
};
