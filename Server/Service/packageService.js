const Package = require("../Model/package");
const { createCustomError } = require("../Middleware/Errors/errorHandler");
const UserPackage = require("../Model/userPackages");
const Hospital = require("../Model/hospitalModel");
const { COMMON_STATUS } = require("../Util/constants");
const { Op } = require("sequelize");
const sequelize = require("../database");

/**
 * Retrieve a package by its packageId and check if it's active.
 *
 * @function
 * @async
 * @param {string} packageId - The ID of the package to retrieve.
 * @throws {CustomError} If the package is not found or not active.
 */
const getById = async (packageId) => {
  const packageValid = await Package.findOne({
    where: { id: packageId, status: COMMON_STATUS.ACTIVE },
  });
  if (!packageValid) {
    // Create custom error
    const error = createCustomError("Package Id not found", 404);
    throw error;
  }
};

/**
 * Get the list of active packages owned by a user.
 *
 * @function
 * @async
 * @param {number} userId - The ID of the user.
 * @returns {Array} - The list of active packages owned by the user.
 */
const packageList = async (userId) => {
  const packages = await UserPackage.findAll({
    where: { userId: userId, status: COMMON_STATUS.ACTIVE },
  });
  return packages;
};

/**
 * Buy a package for a user.
 *
 * @function
 * @async
 * @param {string} userId - The ID of the user buying the package.
 * @param {string} packageId - The ID of the package to be bought.
 * @param {Object} data - Data to be added to the UserPackage table.
 * @throws {CustomError} If there's an issue with package validity or existing packages.
 */
const getAndBuyPackage = async (userId, packageId, data) => {
  //get package details
  const packageDetails = await Package.findByPk(packageId);
  let status = 1;
  if (packageDetails?.dataValues?.validity < Date.now()) {
    //create error when the package expired
    const error = createCustomError("Package validity Expired", 400);
    throw error;
  }

  //checks if the user contains any package
  const packages = await UserPackage.findOne({
    where: { userId: userId, status: COMMON_STATUS.ACTIVE },
    include: { model: Package },
  });

  const validity = new Date(packages?.package?.validity);
  if (validity && validity < Date.now()) {
    status = 0;
    await UserPackage.update({ status: COMMON_STATUS.INACTIVE });
  }

  if (validity && validity > Date.now() && status == 1) {
    const error = createCustomError("User already have package", 400);
    throw error;
  } else {
    await UserPackage.create(data);
  }
};

/**
 * Get the list of packages associated with a hospital.
 *
 * @function
 * @async
 * @param {number} hospitalId - The ID of the hospital.
 * @param {number} limit - The number of packages to retrieve per page.
 * @param {number} page - The current page number.
 * @returns {Object} - An object containing the retrieved packages and the total count.
 */
const getHospitalPackage = async (hospitalId, limit, page) => {
  const hospitalPackages = await Package.findAndCountAll({
    where: {
      hospitalId: hospitalId,
    },
    limit: limit,
    offset: (page - 1) * limit,
    order: [["updatedAt", "DESC"]],
  });

  return {
    items: hospitalPackages.rows,
    count: hospitalPackages.count,
  };
};

/**
 * Get a hospital by its ID and validate its active status.
 *
 * @function
 * @async
 * @param {number} hospitalId - The ID of the hospital to retrieve.
 */
const getHospitalId = async (hospitalId) => {
  const hospital = await Hospital.findOne({
    where: { id: hospitalId, status: COMMON_STATUS.ACTIVE },
  });
  if (!hospital) {
    const error = createCustomError("Hospital Id not found", 404);
    throw error;
  }
};

const allPackages = async (page, limit, search, hospitalId) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  let includeClause = [{ model: Hospital, attributes: ["id", "name"] }];
  if (hospitalId) {
    whereClause.hospitalId = hospitalId;
  }
  if (search) {
    whereClause.packageName = { [Op.like]: `%\\${search}%` };
  }
  const packageList = await Package.findAndCountAll({
    offset: (page - 1) * limit,
    limit: limit,
    order: [["createdAt", "DESC"]],
    where: whereClause,
    include: includeClause,
  });
  return {
    items: packageList.rows,
    count: packageList.count,
  };
};

const addPackage = async (data) => {
  await Package.create(data);
};

const updatePackage = async (data, id) => {
  await Package.update(data, { where: { id: id } });
};

const getUserPackages = async(id) => {
  const packages = await UserPackage.findAll({where : {id : id},include:[{model : Package,where: {
    validity: {
      [Op.gte]: new Date(), // Get packages with validity greater than or equal to the current date
    },
  },}]})
  if(packages.length != 0){
    const error = createCustomError("Package is used by user", 400);
    throw error;
  }
  return packages
}

const packageDelete = async (data, id) => {
  await sequelize.transaction(async (t) => {
    await UserPackage.update(
      { status: COMMON_STATUS.INACTIVE },
      { where: { packageId: id } },
      { transaction: t }
    );

    await Package.update(data, { where: { id: id } }, { transaction: t });
  });
};
module.exports = {
  getById,
  packageList,
  getAndBuyPackage,
  getHospitalPackage,
  getHospitalId,
  allPackages,
  addPackage,
  updatePackage,
  packageDelete,
  getUserPackages
};
