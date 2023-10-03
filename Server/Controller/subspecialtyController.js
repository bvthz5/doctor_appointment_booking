const {
  getspecilityHospitalbySubSpecialty,
} = require("../Service/hospitalService");
const { getHospitalId } = require("../Service/packageService");
const { getSpecialtyById } = require("../Service/specialityService");
const { subSpecialtyAdd } = require("../Service/subspecialtyService");
const subSpecialtyService = require("../Service/subspecialtyService");
const { COMMON_STATUS } = require("../Util/constants");
const logger = require("../logger");

/**
 * Add a new sub-specialty to the system.
 *
 * @async
 * @function addSubSpeciality
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @throws {Error} If an error occurs while processing the request.
 * @returns {void}
 */
const addSubSpeciality = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const specialtyId = req.body.specialtyId;
  try {
    const specialty = await getSpecialtyById(specialtyId);
    if (!specialty) {
      res.status(404).send({ errorCode: 1091, message: "Specialty not found" });
    } else {
      const data = {
        SubSpecialtyName: req.body.subSpecialtyName,
        description: req.body.description,
        specialtyId: req.body.specialtyId,
        status: COMMON_STATUS.ACTIVE,
      };
      data.status = COMMON_STATUS.ACTIVE;
      await subSpecialtyAdd(data);
      res.status(200).send({ message: "SubSpecialty added successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Edit a sub-specialty by ID if it exists, updating its properties.
 *
 * @async
 * @function editSubSpeciality
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @throws {Error} If an error occurs while processing the request.
 * @returns {void}
 */
const editSubSpeciality = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  try {
    const subSpecialtyId = req.params.id;
    console.log(subSpecialtyId);
    const subspecialty = await subSpecialtyService.subSpecialtyById(
      subSpecialtyId
    );
    if (!subspecialty) {
      res
        .status(404)
        .send({ errorCode: 1110, message: "Sub speciality id not found" });
    } else {
      const specialtyId = req.body.specialtyId;
      const specialty = await getSpecialtyById(specialtyId);
      if (!specialty) {
        res
          .status(404)
          .send({ errorCode: 1091, message: "Specialty not found" });
      } else {
        const data = {
          SubSpecialtyName: req.body.subSpecialtyName,
          description: req.body.description,
          specialtyId: req.body.specialtyId,
        };
        data.status = COMMON_STATUS.ACTIVE;
        await subSpecialtyService.updateSubSpecialty(data, subSpecialtyId);
        res.status(200).send({ message: "SubSpecialty updated successfully" });
      }
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a sub-specialty by ID, if it exists and is not allocated to hospitals.
 *
 * @async
 * @function deleteSubSpecialty
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @throws {Error} If an error occurs while processing the request.
 * @returns {void}
 */
const deleteSubSpecialty = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  try {
    const id = req.params.id;
    const subspecialty = await subSpecialtyService.subSpecialtyById(id);
    if (!subspecialty) {
      res
        .status(404)
        .send({ errorCode: 1110, message: "Sub speciality id not found" });
    } else {
      const specialtyHospitals = await getspecilityHospitalbySubSpecialty(id);
      if (specialtyHospitals) {
        res.status(404).send({
          errorCode: 1889,
          message: "Sub Specialty is allocated to hospitals, unable to delete",
        });
      } else {
        const data = {
          status: COMMON_STATUS.INACTIVE,
        };
        await subSpecialtyService.updateSubSpecialty(data, id);
        res.status(200).send({ message: "Sub Specialty deleted successfully" });
      }
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Retrieve a list of sub-specialties with pagination, optional search, and filter by specialty.
 *
 * @async
 * @function getAllSubSpecialty
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @throws {Error} If an error occurs while processing the request.
 * @returns {void}
 */
const getAllSubSpecialty = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const specialtyId = req.query.specialtyId;
    const { items, count } = await subSpecialtyService.subSpecialtyLists(
      page,
      limit,
      search,
      specialtyId
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
    logger.info("Sub Specialty Listed");
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const allSubSpecialties = async (req, res,next) => {
  try {
    await getHospitalId(req.params.hospitalId);
    await subSpecialtyService.specialtyExists(req.params.specialtyId)
    const subSpecialties = await subSpecialtyService.allSubSpecialtyLists(
      req.params.hospitalId,
      req.params.specialtyId
    );
    res.send(subSpecialties);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllSubSpecialty,
  deleteSubSpecialty,
  editSubSpeciality,
  addSubSpeciality,
  allSubSpecialties,
};
