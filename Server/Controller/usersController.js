const { validationResult } = require("express-validator");
const {
  getAllHospitals,
  getHospitalDetail,
  getAllServices,
  getServiceDetail,
  getAllSpecialty,
  getSpecialtyDetail,
  getSubSpecialty,
  getSubSpecialtyDetail,
  getAllFacilitiesList,
  getFacilityDetail,
  getCounts,
  getSpecialtyList,
  getAllUsersList,
  getUser,
  userDelete,
  getAllFacilitiess,
  getFacilityByName,
  addNewFacility,
  facilityUpdate,
  getFacilityId,
  getServiceByName,
  addNewService,
  getServiceById,
  serviceUpdate,
  allServiceList,
  isServiceAllocated,
  isFacilityAllocated,
  listAllServices,
  listAllFacilities
} = require("../Service/usersService");
const { tryCatch } = require("../Middleware/Errors/tryCatch");
const logger = require("../logger");
const { COMMON_STATUS } = require("../Util/constants");

/**
 * Get a list of hospitals with pagination and sorting.
 *
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
const getAllHospitalView = tryCatch(async (req, res) => {
  // Validate request parameters using express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation error: ${errors.errors[0].msg}`);
    return res.status(400).send(errors.errors[0].msg);
  }

  // Parse pagination and sorting parameters from the request query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || null;
  const orderByEmail = req.query.orderByEmail === "true";
  const sortOrder = req.query.sortOrder === "desc" ? "DESC" : "ASC";

  // Call the service method to get hospitals with pagination and sorting
  const { hospitals, totalRecords, hasPrevious } = await getAllHospitals(
    page,
    limit,
    search,
    orderByEmail,
    sortOrder
  );

  // Calculate the total number of pages and whether there's a next page available
  const totalPages = Math.ceil(totalRecords / limit);
  const hasNext = page < totalPages;

  const response = {
    Items: hospitals,
    Count: totalRecords,
    currentPage: page,
    TotalPages: totalPages,
    HasNext: hasNext,
    HasPrevious: hasPrevious,
  };
  res.status(200).json(response);
  logger.info("Hospital Listed");
});

/**
 * Get detailed information about a hospital by ID.
 *
 * @function
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - JSON response containing hospital details or error.
 */
const hospitalList = tryCatch(async (req, res) => {
  // Extract the hospital ID from the request parameters
  const hospitalId = req.params.id;

  // Call the service method to get the hospital details by ID
  const hospitalDetailView = await getHospitalDetail(hospitalId);

  // If the hospitalDetailView is null or undefined, the hospital was not found
  if (!hospitalDetailView) {
    logger.warn(`Hospital not found for ID: ${hospitalId}`);
    return res
      .status(404)
      .json({ errorcode: "1065", message: "Hospital not found" });
  }
  logger.info(`Hospital details retrieved for ID: ${hospitalId}`);
  return res.status(200).json(hospitalDetailView);
});

/**
 * Retrieve a list of services (specialties, subspecialty, or hospitals) based on the provided parameters.
 *
 * @function
 * @param {Object} req - The request object containing query parameters.
 * @param {Object} res - The response object to send the retrieved services.
 * @returns {void}
 */
const getAllService = tryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation errors:", errors.array());
    return res.status(400).send(errors.errors[0].msg);
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const id = req.params.id;
  const type = parseInt(req.query.type) || 0; // 0 as default (specialty)

  if (![0, 1, 2].includes(type)) {
    logger.warn(
      "Invalid Type. Use 0 for subspecialty, 1 for specialty, or 2 for hospital."
    );
    return res.status(400).json({
      errorCode: "1141",
      message:
        "Invalid Type. Use 0 for subspecialty, 1 for specialty, or 2 for hospital.",
    });
  }

  const { items, count } = await getAllServices(page, limit, id, type);

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
  logger.info("Service Listed");
});

/**
 * Retrieves details about a specific service by its ID.
 *
 * @function
 * @async
 * @param {object} req - Express request object.
 * @param {object} res - Express response object to send the response.
 */
const serviceList = tryCatch(async (req, res) => {
  const serviceId = req.params.id;
  const serviceDetailView = await getServiceDetail(serviceId);
  if (!serviceDetailView) {
    logger.warn("Service not found with ID:", serviceId);
    return res
      .status(404)
      .json({ errorCode: "1140", message: "Service not found" });
  }
  logger.info(`Service details retrieved`);
  return res.status(200).json(serviceDetailView);
});

/**
 * Fetches and lists specialties associated with a hospital based on hospital ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllSpecialtyList = tryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation errors:", errors.array());
    return res.status(400).send(errors.errors[0].msg);
  }

  const hospitalId = req.params.id;
  if (!hospitalId) {
    logger.warn("Hospital ID not provided");
    return res
      .status(404)
      .json({ errorCode: "1065", message: "Hospital not found" });
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { items, count } = await getAllSpecialty(page, limit, hospitalId);

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
});

/**
 * Fetches and provides details of a specific specialty based on its ID.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const specialtyDetailView = tryCatch(async (req, res) => {
  const specialtyId = req.params.id;
  const specialtyDetailView = await getSpecialtyDetail(specialtyId);
  if (!specialtyDetailView) {
    logger.warn("Specialty not found");
    return res
      .status(404)
      .json({ errorCode: "1090", message: "Specialty not found" });
  }
  logger.info("Specialty Listed");
  return res.status(200).json(specialtyDetailView);
});

/**
 * Fetches a list of specialties with pagination.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */

const specialtyList = tryCatch(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { items, count } = await getSpecialtyList(page, limit);

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
});

/**
 * Fetches a list of sub-specialties with pagination.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllSubSpecialty = tryCatch(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const id = req.params.id;
  const type = parseInt(req.query.type) || 1; // 1 as default (specialty)
  if (![0, 1].includes(type)) {
    logger.warn("Invalid Type. Use 0 for hospital or 1 for specialty.");
    return res.status(400).json({
      errorCode: "1141",
      message: "Invalid Type. Use 0 for hospital or 1 for specialty.",
    });
  }

  const { items, count } = await getSubSpecialty(page, limit, id, type);
  const totalPages = Math.ceil(count / limit);
  const hasNext = page < totalPages;

  const response = {
    items,
    count,
    hasNext,
    currentPage: page,
    totalPages,
    specialtyId: id,
    type,
  };

  res.status(200).json(response);
  logger.info("Sub-Specialty Listed");
});

/**
 * Retrieves details about a specific sub-specialty.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const subSpecialtyDetailView = tryCatch(async (req, res) => {
  const subSpecialtyId = req.params.id;
  const subSpecialtyDetailView = await getSubSpecialtyDetail(subSpecialtyId);
  if (!subSpecialtyDetailView) {
    logger.warn("Sub-Specialty not found");
    return res
      .status(404)
      .json({ errorCode: "1090", message: "Sub-Specialty not found" });
  }
  logger.info("Sub-Specialty details retrieved");
  return res.status(200).json(subSpecialtyDetailView);
});

/**
 * Retrieves a list of facilities (e.g., specialties, sub-specialties, or hospitals).
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllFacilities = tryCatch(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn("Validation errors:", errors.array());
    return res.status(400).send(errors.errors[0].msg);
  }
  const id = req.params.id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const type = parseInt(req.query.type) || 0; // 0 as default (specialty)

  if (![0, 1, 2].includes(type)) {
    logger.warn("Invalid Type:", type);
    return res.status(400).json({
      errorCode: "1141",
      message:
        "Invalid Type. Use 0 for subspecialty, 1 for specialty, or 2 for hospital.",
    });
  }

  const { items, count } = await getAllFacilitiesList(page, limit, id, type);

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
  logger.info("Facility Listed");
});

/**
 * Retrieves detailed information about a facility.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const facilityDetailView = tryCatch(async (req, res) => {
  const facilityId = req.params.id;
  const facilityDetailView = await getFacilityDetail(facilityId);
  if (!facilityDetailView) {
    logger.warn("Facility not found with ID:", facilityId);
    return res
      .status(404)
      .json({ errorCode: "1090", message: "Facility not found" });
  }
  logger.info("Facility details retrieved");
  return res.status(200).json(facilityDetailView);
});

/**
 * Retrieves various counts.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getAllCounts = async (req, res) => {
  try {
    const count = await getCounts();
    res.send(count);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    res
      .status(500)
      .send({ errorCode: 1905, message: "An unexpected error occured" });
  }
};

const getUsersList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const { items, count } = await getAllUsersList(page, limit, search);

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
    logger.info("user Listed");
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const userId = req.params.id;

  try {
    const user = await getUser(userId);
    if (!user) {
      return res
        .status(400)
        .send({ errorCode: 1032, message: "User not found" });
    } else {
      await userDelete(userId);
      res.send({ message: "User deleted successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const getAllFacilityList = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.params;
  const { items, count } = await getAllFacilitiess(page, limit, search);

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
  logger.info("Facility Listed");
};

const addFacility = async (req, res, next) => {
  try {
    const data = req.body;
    await getFacilityByName(data?.facilityName);
    data.status = COMMON_STATUS.ACTIVE;
    await addNewFacility(data);
    res.status(200).send({ message: "Facility added succesfully" });

    logger.info("Facility added");
  } catch (error) {
    next(error);
  }
};

const updateFacility = async (req, res, next) => {
  try {
    const data = req?.body;
    await getFacilityId(req?.params?.id);
    await getFacilityByName(data?.facilityName, req?.params?.id);
    await facilityUpdate(req?.params?.id, data);
    res.status(200).send({ message: "Facility updated succesfully" });
    logger.info("Facility updated");
  } catch (error) {
    next(error);
  }
};

const deleteFacility = async (req, res, next) => {
  try {
    const data = {
      status: 0,
    };
    await getFacilityId(req.params.id);
    await isFacilityAllocated(req.params.id)
    await facilityUpdate(req.params.id, data);
    res.status(200).send({ message: "Facility deleted succesfully" });
    logger.info("Facility deleted");
  } catch (error) {
    next(error);
  }
};

const addService = async (req, res, next) => {
  try {
    const data = req.body;
    await getServiceByName(data?.serviceName);
    data.status = COMMON_STATUS.ACTIVE;
    await addNewService(data);
    res.status(200).send({ message: "Service added succesfully" });
    logger.info("Service added");
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const data = req?.body;
    await getServiceById(req?.params?.id);
    await getServiceByName(data?.serviceName, req?.params?.id);
    await serviceUpdate(req?.params?.id, data);
    res.status(200).send({ message: "Service updated succesfully" });
    logger.info("Service updated");
  } catch (error) {
    next(error);
  }
};

const getAllServiceList = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.params;
    const { items, count } = await allServiceList(page, limit, search);

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
    logger.info("Service Listed");
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const data = {
      status: 0,
    };
    await getServiceById(req.params.id);
    await isServiceAllocated(req.params.id)
    await serviceUpdate(req.params.id, data);
    res.status(200).send({ message: "Service deleted succesfully" });
    logger.info("Service deleted");
  } catch (error) {
    next(error);
  }
};

const listServices = tryCatch(async (req, res) => {
  const serviceList = await listAllServices();
  if (!serviceList) {
    logger.warn("Service not found");
    return res
      .status(404)
      .json({ errorCode: "1065", message: "Service not found" });
  }
  logger.info("Service Listed");
  return res.status(200).json(serviceList);
});

const listFacilities = tryCatch(async (req, res) => {
  const facilityList = await listAllFacilities();
  if (!facilityList) {
    logger.warn("Facility not found");
    return res
      .status(404)
      .json({ errorCode: "1064", message: "Facility not found" });
  }
  logger.info("Facility Listed");
  return res.status(200).json(facilityList);
});

module.exports = {
  addFacility,
  getAllFacilityList,
  deleteUser,
  getUsersList,
  getAllHospitalView,
  hospitalList,
  getAllService,
  serviceList,
  getAllSpecialtyList,
  specialtyDetailView,
  getAllSubSpecialty,
  subSpecialtyDetailView,
  getAllFacilities,
  facilityDetailView,
  getAllCounts,
  specialtyList,
  updateFacility,
  deleteFacility,
  addService,
  updateService,
  getAllServiceList,
  deleteService,
  listServices,
  listFacilities
};
