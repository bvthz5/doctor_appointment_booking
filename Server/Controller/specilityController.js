const { tryCatch } = require("../Middleware/Errors/tryCatch");
const {
  specialityHospitalList,
  getSubspecilityIdbySpecialty,
} = require("../Service/hospitalService");
const { getHospitalId } = require("../Service/packageService");
const {
  getSpecialtyByName,
  specialityAdd,
  getSpecialtyById,
  specialityEdit,
  specialtyList,
} = require("../Service/specialityService");
const specialityService = require("../Service/specialityService");
const { COMMON_STATUS } = require("../Util/constants");
const logger = require("../logger");

/**
 * Function to add specialty
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const addSpeciality = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const specialtyName = req.body.specialtyName;
  try {
    const specialty = await getSpecialtyByName(specialtyName);
    if (specialty) {
      res
        .status(403)
        .send({ errorCode: 1075, message: "Specialty already exists" });
    } else {
      const data = req.body;
      data.status = COMMON_STATUS.ACTIVE;
      await specialityAdd(data);
      res.status(200).send({ message: "Specialty added successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Function to edit specialty
 * @param {*} req - req of the api
 * @param {*} res - res of the api
 * @param {*} next
 */
const editSpeciality = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const id = req.params.id;
  try {
    const specialty = await getSpecialtyById(id);
    if (!specialty) {
      return res
        .status(404)
        .send({ errorCode: 1091, message: "Specialty not found" });
    } else {
      const data = req.body;
      await specialityEdit(data, id);
      res.status(200).send({ message: "Specialty updated successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};
/**
 * Function to edit specialty
 * @param {*} req - req of the api
 * @param {*} res - res of the api
 * @param {*} next
 */
const deleteSpeciality = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const id = req.params.id;
  try {
    const specialty = await getSpecialtyById(id);
    if (!specialty) {
      return res
        .status(404)
        .send({ errorCode: 1091, message: "Specialty not found" });
    } else {
      const specialtyHospitals = await getSubspecilityIdbySpecialty(id);
      if (specialtyHospitals) {
        res.status(404).send({
          errorCode: 1888,
          message: "Specialty is allocated to hospitals, unable to delete",
        });
      } else {
        const data = {
          status: COMMON_STATUS.INACTIVE,
        };
        await specialityEdit(data, id);
        res.status(200).send({ message: "Specialty deleted successfully" });
      }
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};
/**
 * Retrieve a list of specialties with pagination and optional search.
 *
 * @async
 * @function getAllSpecialty
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @throws {Error} If an error occurs while processing the request.
 * @returns {void}
 */
const getAllSpecialty = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const { items, count } = await specialityService.specialtyLists(
      page,
      limit,
      search
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

    res.status(200).json(response);
    logger.info("Specialty Listed");
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const allSpecialties = async (req, res,next) => {
  try {
    const hospitalId = req.params.id;
    await getHospitalId(hospitalId);
    const speciality = await specialityService.allList(hospitalId);
    res.send(speciality);
  } catch (err) {
    next(err);
  }
};
const specialty = tryCatch(async (req, res) => {
  const getAllSpecialties = await specialityService.listSpecialties();
  if (!getAllSpecialties) {
    logger.warn("Specialty not found");
    return res
      .status(404)
      .json({ errorCode: "1091", message: "Specialty not found" });
  }
  logger.info("Specialty Listed");
  return res.status(200).json(getAllSpecialties);
});

const getAllSpecialtiesAndSubSpecialties = tryCatch(async (req, res) => {
  const specialties = await specialityService.getSubSpecialtiesForSpecialties();
  if (!specialties) {
    logger.warn("Specialty and subspecialty not found");
    return res
      .status(404)
      .json({ errorCode: "1003", message: "Specialty and subspecialty not found" });
  }
  logger.info("Specialty Listed");
  return res.status(200).json(specialties);
});

module.exports = {
  getAllSpecialty,
  deleteSpeciality,
  editSpeciality,
  addSpeciality,
  allSpecialties,
  specialty,
  getAllSpecialtiesAndSubSpecialties
};
