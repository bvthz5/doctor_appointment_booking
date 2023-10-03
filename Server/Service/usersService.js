const Facility = require("../Model/facilityModel");
const Hospital = require("../Model/hospitalModel");
const Service = require("../Model/serviceModel");
const Specialty = require("../Model/specialtyModel");
const SubSpecialty = require("../Model/subSpecialtyModel");
const { Op, where } = require("sequelize");
const sequelize = require("../database");
const Doctor = require("../Model/doctorModel");
const Booking = require("../Model/bookingModel");
const SpecialtyHospital = require("../Model/specialtyHospitalModel");
const subSpecialtyQuery = require("../Middleware/Query/subSpecialtyQuery");
const {
  formatResponse,
  formatSpecialty,
} = require("../Middleware/Views/formatResponse");
const { COMMON_STATUS } = require("../Util/constants");
const User = require("../Model/userModel");
const { createCustomError } = require("../Middleware/Errors/errorHandler");
const ServiceHospitals = require("../Model/serviceHospitalModal");
const FacilityHospital = require("../Model/facilityHospitalModel");
const Admin = require("../Model/adminsModel");

/**
 * Get a list of hospitals based on pagination and sorting criteria.
 *
 * @function
 * @param {number} page - Page number.
 * @param {number} limit - Number of items per page.
 * @param {string|null} search - Search query for hospital name.
 * @param {boolean} orderByEmail - Flag to indicate if sorting is based on email.
 * @param {string} sortOrder - Sorting order ("ASC" or "DESC").
 * @returns {Object} - Object containing hospitals, totalRecords, and hasPrevious.
 */
const getAllHospitals = async (
  page,
  limit,
  search,
  orderByEmail,
  sortOrder
) => {
  const orderCriteria = orderByEmail ? [["email", sortOrder]] : [];

  const filterCriteria = {
    status: COMMON_STATUS.ACTIVE,
  };

  if (search) {
    filterCriteria.name = { [Op.like]: `%${search}%` };
  }

  const hospitals = await Hospital.findAll({
    attributes: {
      include: [
        [
          sequelize.literal(
            `(SELECT COUNT(*) FROM bookings
              WHERE bookings.doctorId IN (
                SELECT doctors.id FROM doctors
                WHERE doctors.hospitalId = hospital.id
              ))`
          ),
          "bookingCount",
        ],
      ],
    },

    where: filterCriteria,
    order: [
      ["bookingCount", "DESC"], // Sort based on highest booking count
      ...orderCriteria,
    ],
    limit: limit,
    offset: (page - 1) * limit,
  });

  const totalRecords = await Hospital.count({ where: filterCriteria });

  // Calculate hasPrevious based on the current page
  const hasPrevious = page > 1;

  return { hospitals, totalRecords, hasPrevious };
};

const getHospitalDetail = async (hospitalId) => {
  try {
    // Get hospital details by hospitalId
    const hospital = await Hospital.findOne({
      where: { id: hospitalId, status: COMMON_STATUS.ACTIVE },
      include: [{ model: Admin, attributes: ["name"] }],
    });

    // Get specialty details associated with the hospital
    const specialtyHospitals = await SpecialtyHospital.findAll({
      where: { hospitalId, status: COMMON_STATUS.ACTIVE },
      include: [{ model: Specialty, include: SubSpecialty }],
    });

    // Get facility details associated with the hospital
    const facilityHospitals = await FacilityHospital.findAll({
      where: { hospitalId, status: COMMON_STATUS.ACTIVE },
      include: [
        {
          model: Facility,
          attributes: ["id", "facilityName"],
        },
      ],
    });

    // Get service details associated with the hospital
    const serviceHospitals = await ServiceHospitals.findAll({
      where: { hospitalId, status: COMMON_STATUS.ACTIVE },
      include: [
        {
          model: Service,
          attributes: ["id", "serviceName"],
        },
      ],
    });

    return {
      hospital,
      specialties: specialtyHospitals,
      facilities: facilityHospitals,
      services: serviceHospitals,
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Generate the appropriate whereClause and includeClause based on the service type and ID.
 *
 * @function
 * @param {number} type - The type of service (0 for subspecialty, 1 for specialty, 2 for hospital).
 * @param {string} id - The ID parameter for filtering.
 * @returns {Object} - An object containing the generated whereClause and includeClause.
 */
const getWhereClauseAndIncludeClause = (type, id) => {
  let whereClause = {};
  let includeClause = [];

  switch (type) {
    case 0: // Subspecialty
      whereClause = { subspecialtyId: id, status: 1 };
      includeClause = [{ model: SubSpecialty, as: "subspecialty" }];
      break;
    case 1: // Specialty
      whereClause = { subspecialtyId: id, status: COMMON_STATUS.ACTIVE };
      includeClause = [
        {
          model: SubSpecialty,
          as: "subspecialty",
          include: [
            {
              model: Specialty,
              as: "specialty",
            },
          ],
        },
      ];
      break;
    case 2: // Hospital
      whereClause = { status: COMMON_STATUS.ACTIVE };
      includeClause = [
        {
          model: SubSpecialty,
          as: "subspecialty",
          attributes: ["id", "SubSpecialtyName", "description"],
          where: whereClause,
          include: [
            {
              model: Specialty,
              as: "specialty",
              attributes: ["id", "specialtyName", "description"],
              include: [
                {
                  model: SpecialtyHospital,
                  as: "specialtyHospitals",
                  attributes: ["id", "hospitalId", "specialtyId"],
                  where: { hospitalId: id },
                  include: [
                    {
                      model: Hospital,
                      as: "hospital",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ];
      break;
    default:
      throw new Error(
        "Invalid Type. Use 0 for subspecialty, 1 for specialty, or 2 for hospital."
      );
  }

  return { whereClause, includeClause };
};

/**
 * Retrieve a list of services (specialties, subspecialties, or hospitals) based on the provided parameters.
 *
 * @function
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The number of items per page.
 * @param {string} id - The ID parameter for filtering.
 * @param {number} type - The type of service (0 for subspecialty, 1 for specialty, 2 for hospital).
 * @returns {Object} - An object containing the list of retrieved services and total count.
 */
const getAllServices = async (page, limit, id, type) => {
  const { whereClause, includeClause } = getWhereClauseAndIncludeClause(
    type,
    id
  );

  const services = await Service.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
    include: includeClause,
    attributes: [
      "id",
      "serviceName",
      "description",
      "status",
      "createdAt",
      "updatedAt",
    ],
  });

  return {
    items: services.rows,
    count: services.count,
  };
};

/**
 * Fetches service details based on the provided service ID.
 *
 * @function
 * @async
 * @param {number} serviceId - The ID of the service to fetch.
 * @returns {Promise<Object>} A promise that resolves to the service details or null if not found.
 */
const getServiceDetail = async (serviceId) => {
  const service = await Service.findOne({
    where: { id: serviceId, status: COMMON_STATUS.ACTIVE },
  });
  return service;
};

/**
 * Retrieves a list of specialties associated with a specific hospital.
 *
 * @function
 * @async
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The maximum number of items per page.
 * @param {number} hospitalId - The ID of the hospital to retrieve specialties for.
 * @returns {Promise<Object>} - An object containing the retrieved specialties and count.
 */
const getAllSpecialty = async (page, limit, hospitalId) => {
  const specialty = await Specialty.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: { status: COMMON_STATUS.ACTIVE },
    include: [
      {
        model: SpecialtyHospital,
        as: "specialtyHospitals",
        where: { hospitalId: hospitalId },
        include: [
          {
            model: Hospital,
            as: "hospital",
            attributes: [
              "id",
              "name",
              "address",
              "email",
              "contactNo",
              "city",
              "fileKey",
              "status",
            ],
          },
        ],
      },
    ],
  });

  return {
    items: specialty.rows,
    count: specialty.count,
  };
};

/**
 * Retrieves the details of a specialty based on the provided specialty ID.
 *
 * @function
 * @async
 * @param {number} specialtyId - The ID of the specialty to retrieve details for.
 * @returns {Promise<Object>} - The details of the retrieved specialty.
 */
const getSpecialtyDetail = async (specialtyId) => {
  const specialty = await Specialty.findOne({
    where: { id: specialtyId, status: COMMON_STATUS.ACTIVE },
  });
  return specialty;
};

/**
 * Retrieves a list of specialties with pagination.
 *
 * @function
 * @async
 * @param {number} page - The current page number.
 * @param {number} limit - The maximum number of items per page.
 * @returns {Promise<Object>} - An object containing the list of specialties and total count.
 */
const getSpecialtyList = async (page, limit) => {
  const listSpecialty = await Specialty.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: { status: COMMON_STATUS.ACTIVE },
  });
  return {
    items: listSpecialty.rows,
    count: listSpecialty.count,
  };
};

/**
 * Retrieves a list of sub-specialties based on the provided type (hospital or specialty).
 *
 * @function
 * @async
 * @param {number} page - The current page number.
 * @param {number} limit - The maximum number of items per page.
 * @param {number} id - The ID of the hospital or specialty.
 * @param {number} type - The type of item (0 for hospital, 1 for specialty).
 * @returns {Promise<Object>} - An object containing the list of sub-specialties and total count.
 */
const getSubSpecialty = async (page, limit, id, type) => {
  let query = subSpecialtyQuery; // Use query

  //hospital
  if (type === 0) {
    query += ` AND h.id = :hospitalId`;
  }
  //specialties
  else if (type === 1) {
    query += ` AND sp.id = :specialtyId`;
  } else {
    throw new Error("Invalid Type. Use 0 for hospital or 1 for specialty.");
  }

  query += `
    ORDER BY ss.id
    LIMIT :limit OFFSET :offset`;

  const replacements = {
    hospitalId: id,
    specialtyId: id,
    limit: limit,
    offset: (page - 1) * limit,
  };

  const results = await sequelize.query(query, {
    replacements,
    type: sequelize.QueryTypes.SELECT,
  });

  if (type === 0) {
    // Format the response for type 0
    return {
      items: formatResponse(results),
      count: results.length,
    };
  } else if (type === 1) {
    // Return the response for type 1 directly
    return {
      items: formatSpecialty(results),
      count: results.length,
    };
  }
};

/**
 * Retrieves details of a specific sub-specialty based on the provided subSpecialtyId.
 *
 * @function
 * @async
 * @param {number} subSpecialtyId - The ID of the sub-specialty.
 * @returns {Promise<Object>} - Details of the sub-specialty.
 */
const getSubSpecialtyDetail = async (subSpecialtyId) => {
  const subSpecialty = await SubSpecialty.findOne({
    where: { id: subSpecialtyId, status: COMMON_STATUS.ACTIVE },
  });
  return subSpecialty;
};

/**
 * Retrieves a list of facilities based on the provided parameters.
 *
 * @function
 * @async
 * @param {number} page - The page number for pagination.
 * @param {number} limit - The maximum number of items per page.
 * @param {number} id - The ID of the hospital or specialty.
 * @param {number} type - The type (0 for hospital, 1 for specialty) to determine the context.
 * @returns {Promise<Object>} - A paginated list of facilities.
 */

const getAllFacilitiesList = async (page, limit, id, type) => {
  const { whereClause, includeClause } = getWhereClauseAndIncludeClause(
    type,
    id
  );

  const facilities = await Facility.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
    include: includeClause,
  });

  return {
    items: facilities.rows,
    count: facilities.count,
  };
};

const getAllFacilitiess = async (page, limit, search) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  if (search) {
    whereClause.facilityName = { [Op.like]: `%\\${search}%` };
  }
  const facilities = await Facility.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });

  return {
    items: facilities.rows,
    count: facilities.count,
  };
};

const getFacilityId = async (id) => {
  const facility = await Facility.findOne({
    where: { id: id, status: COMMON_STATUS.ACTIVE },
  });
  if (!facility) {
    const error = createCustomError("Facility id not found", 404);
    throw error;
  }
  return facility;
};

const getFacilityByName = async (facilityName, id) => {
  let facility;
  let whereClause = {
    facilityName: facilityName,
    status: COMMON_STATUS.ACTIVE,
  };
  if (id) {
    whereClause.id = { [Op.not]: id };
  }
  facility = await Facility.findOne({ where: whereClause });

  if (facility) {
    const error = createCustomError("Facility already exists", 400);
    throw error;
  }

  return facility;
};

const addNewFacility = async (data) => {
  await Facility.create(data);
};

const facilityUpdate = async (id, data) => {
  await Facility.update(data, { where: { id: id } });
};

const isFacilityAllocated = async (id) => {
  const service = await FacilityHospital.findAll({
    where: { facilityId: id, status: COMMON_STATUS.ACTIVE },
  });
  if (service.length != 0) {
    const error = createCustomError(
      "Facility already allocated to hospitals",
      400
    );
    throw error;
  }
};

const getServiceByName = async (serviceName, id) => {
  let service;
  let whereClause = {
    serviceName: serviceName,
    status: COMMON_STATUS.ACTIVE,
  };
  if (id) {
    whereClause.id = { [Op.not]: id };
  }
  service = await Service.findOne({ where: whereClause });

  if (service) {
    const error = createCustomError("Service already exists", 400);
    throw error;
  }

  return service;
};

const addNewService = async (data) => {
  await Service.create(data);
};

const getServiceById = async (id) => {
  const service = await Service.findOne({
    where: { id: id, status: COMMON_STATUS.ACTIVE },
  });
  if (!service) {
    const error = createCustomError("Service not found", 404);
    throw error;
  }
  return service;
};

const isServiceAllocated = async (id) => {
  const service = await ServiceHospitals.findAll({
    where: { serviceId: id, status: COMMON_STATUS.ACTIVE },
  });
  if (service.length != 0) {
    const error = createCustomError(
      "Service already allocated to hospitals",
      400
    );
    throw error;
  }
};

const serviceUpdate = async (id, data) => {
  await Service.update(data, { where: { id: id } });
};

const allServiceList = async (page, limit, search) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  if (search) {
    whereClause.serviceName = { [Op.like]: `%\\${search}%` };
  }
  const services = await Service.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });

  return {
    items: services.rows,
    count: services.count,
  };
};
/**
 * Retrieves the details of a facility based on the provided facilityId.
 *
 * @function
 * @async
 * @param {number} facilityId - The ID of the facility.
 * @returns {Promise<Facility|null>} - The facility details or null if not found.
 */
const getFacilityDetail = async (facilityId) => {
  const facility = await Facility.findOne({
    where: { id: facilityId, status: COMMON_STATUS.ACTIVE },
  });
  return facility;
};

/**
 * Retrieves counts of doctors, hospitals, and patients.
 *
 * @function
 * @async
 * @returns {Promise<{ doctorCount: number, hospitalCount: number, patientCount: number }>} - The counts of doctors, hospitals, and patients.
 */
const getCounts = async () => {
  const doctorCount = await Doctor.count({
    where: { status: COMMON_STATUS.ACTIVE },
  });
  const hospitalCount = await Hospital.count({
    where: { status: COMMON_STATUS.ACTIVE },
  });
  const patients = await Booking.findAll({
    attributes: [
      "userId",
      [sequelize.fn("COUNT", sequelize.col("userId")), "bookingCount"],
    ],
    group: ["userId"],
    raw: true,
  });
  const patientCount = patients.length;

  return {
    doctorCount,
    hospitalCount,
    patientCount,
  };
};
/**
 *
 * @param {*} id
 * @returns
 */
const getSubSpecialtybySpecialityId = async (id) => {
  const subspecilityList = await SubSpecialty.findAll({
    where: {
      specialtyId: id,
      status: 1,
    },
  });
  return subspecilityList;
};

/**
 * Function to get the list of all users
 * @param {*} page - page number which list should get
 * @param {*} limit - count of the date need to be listed
 * @param {*} search  - value of search field
 * @returns
 */
const getAllUsersList = async (page, limit, search) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  if (search) {
    whereClause[Op.or] = [
      { firstName: { [Op.like]: `%\\${search}%` } },
      { lastName: { [Op.like]: `%\\${search}%` } },
    ];
  }
  const users = await User.findAndCountAll({
    attributes: { exclude: ["otp"]["validity"] },
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
    order: [["createdAt", "DESC"]],
  });

  return {
    items: users.rows,
    count: users.count,
  };
};

/**
 * Function to delete user
 * @param {*} id - id of the user that want to delete
 */
const userDelete = async (id) => {
  await User.update(
    { status: COMMON_STATUS.INACTIVE },
    {
      where: {
        id: id,
      },
    }
  );
};

/**
 * Function to get the details of a user bu user Id
 * @param {*} id - id user the
 * @returns - details of the user
 */
const getUser = async (id) => {
  const user = await User.findOne({
    where: {
      id: id,
      status: COMMON_STATUS.ACTIVE,
    },
  });

  return user;
};

const allHospital = async () => {
  const hospital = await Hospital.findAll({
    where: { status: COMMON_STATUS.ACTIVE },
    attributes: ["id", "name"],
  });
  return hospital;
}
const listAllServices = async () => {
  const service = await Service.findAll({
    where: {
      status: 1,
    },
  });
  return service;
};

const listAllFacilities = async () => {
  const service = await Facility.findAll({
    where: {
      status: 1,
    },
    attributes: ["id", "facilityName"],
  });
  return service;
};

module.exports = {
  addNewFacility,
  facilityUpdate,
  getFacilityByName,
  getAllFacilitiess,
  userDelete,
  getUser,
  getAllUsersList,
  getSubSpecialtybySpecialityId,
  getAllHospitals,
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
  getFacilityId,
  getServiceByName,
  addNewService,
  getServiceById,
  serviceUpdate,
  allServiceList,
  isServiceAllocated,
  isFacilityAllocated,
  allHospital,
  listAllServices,
  listAllFacilities,
  getHospitalDetail,
};
