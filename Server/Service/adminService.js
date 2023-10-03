const { Op } = require("sequelize");
const Admin = require("../Model/adminsModel");
const { COMMON_STATUS } = require("../Util/constants");
const Hospital = require("../Model/hospitalModel");
const { createCustomError } = require("../Middleware/Errors/errorHandler");

/**
 * Function to check the user with the given email is present in the admin table
 * @param {string} email - email to check whether the user exist or not
 * @returns the details of the user
 */
const checkAdminExist = async (email) => {
  const user = await Admin.findOne({
    where: {
      email: email,
      status: 1,
    },
  });
  return user;
};

const adminExist = async (email) => {
  const admin = await Admin.findOne({
    where: {
      email: email,
    },
  });
  return admin;
};

const getAdminById = async (id) => {
  const admin = await Admin.findOne({
    attributes: { exclude: ["password"] },
    where: {
      id: id,
      status: COMMON_STATUS.ACTIVE,
    },
  });
  return admin;
};

const adminList = async (page, limit, search) => {
  const { Op } = require("sequelize");

  let whereClause = { status: COMMON_STATUS.ACTIVE ,role : 1};
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%\\${search}%` } },
      { email: { [Op.like]: `%\\${search}%` } },
    ];
  }

  const listAdmin = await Admin.findAndCountAll({
    attributes: { exclude: ["password"] },
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
    order : [['createdAt','DESC']]
  });

  return {
    items: listAdmin.rows,
    count: listAdmin.count,
  };
};

const adminAdd = async (data) => {
  await Admin.create(data);
};

const editAdmin = async (data, id) => {
  await Admin.update(data, { where: { id: id } });
};


const getHospital = async (adminId) => {
  const hospital = await Hospital.findOne({
    where: {
      adminId: adminId,
      status: COMMON_STATUS.ACTIVE,
    },
  });
  if(!hospital){
     // Create custom error
     const error = createCustomError("No hospital allocated for admin", 400);
     throw error;
  }
  return hospital.dataValues.id;
}
const listAdminsByStatusAndRole = async () => {
  const admins = await Admin.findAll({
    where: {
      status: 1,
      role: 1,
    },
    attributes: ["id", "name"],
  });
  return admins;
};

module.exports = {
  editAdmin,
  getAdminById,
  adminList,
  checkAdminExist,
  adminExist,
  adminAdd,
  getHospital,
  listAdminsByStatusAndRole,
};
