const { Op } = require("sequelize");
const Speciality = require("../Model/specialtyModel");
const { COMMON_STATUS } = require("../Util/constants");
const SpecialtyHospital = require("../Model/specialtyHospitalModel");
const { specialityList } = require("../Middleware/Views/formatResponse");
const SubSpecialty = require("../Model/subSpecialtyModel");

/**
 * Add a new specialty to the system.
 *
 * @async
 * @function specialityAdd
 * @param {object} data - An object containing the properties of the new specialty.
 * @throws {Error} If an error occurs while adding the specialty.
 */
const specialityAdd = async (data) => {
  await Speciality.create(data);
};

const getSpecialtyByName = async (specialtyName) => {
  const specialty = await Speciality.findOne({
    where: {
      specialtyName: specialtyName,
      status: COMMON_STATUS.ACTIVE,
    },
  });

  return specialty;
};

/**
 * Retrieve a specialty by its ID if it exists and is active.
 *
 * @async
 * @function getSpecialtyById
 * @param {number} id - The ID of the specialty to retrieve.
 * @throws {Error} If an error occurs while fetching the specialty.
 * @returns {Promise<object|null>} The retrieved specialty object or null if not found.
 */
const getSpecialtyById = async (id) => {
  const specialty = await Speciality.findOne({
    where: {
      id: id,
      status: COMMON_STATUS.ACTIVE,
    },
  });

  return specialty;
};

/**
 * Edit a specialty's properties by ID.
 *
 * @async
 * @function specialityEdit
 * @param {object} data - An object containing the updated properties of the specialty.
 * @param {number} id - The ID of the specialty to edit.
 * @throws {Error} If an error occurs while updating the specialty.
 */
const specialityEdit = async (data, id) => {
  await Speciality.update(data, {
    where: {
      id: id,
    },
  });
};

/**
 * Retrieve a list of specialties with optional pagination and search functionality.
 *
 * @async
 * @function specialtyLists
 * @param {number} page - The current page of results (default: 1).
 * @param {number} limit - The number of results per page (default: 10).
 * @param {string} search - A search query to filter results (optional).
 * @throws {Error} If an error occurs while fetching the specialties.
 * @returns {Promise<{items: object[], count: number}>} An object containing the list of specialties and the total count.
 */
const specialtyLists = async (page, limit, search) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  if (search) {
    whereClause.specialtyName = { [Op.like]: `%\\${search}%` };
  }
  const list = await Speciality.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
  });

  return {
    items: list.rows,
    count: list.count,
  };
};

const allList = async (id) => {
  const allSpecialties = await SpecialtyHospital.findAll({
    where: { hospitalId: id, status: COMMON_STATUS.ACTIVE },
    attributes: ["specialtyId"],
    include: [{ model: Speciality ,attributes:['id','specialtyName']}],
  });
  const specialties = specialityList(allSpecialties)
  return specialties;
};

const listSpecialties = async () => {
  const specialties = await Speciality.findAll({
    where: {
      status: 1,
    },
  });
  return specialties;
};

const getSubSpecialtiesForSpecialties = async () => {
  const specialties = await Speciality.findAll({
    attributes: ["id", "specialtyName"],
    include: [
      {
        model: SubSpecialty,
        attributes: ["id", "SubSpecialtyName"],
      },
    ],
  });

  // Transform the data into the desired format
  const formattedSpecialties = specialties.map((specialty) => ({
    id: specialty.id,
    name: specialty.specialtyName,
    subspecialities: specialty.subspecialties.map((subspecialty) => ({
      id: subspecialty.id,
      name: subspecialty.SubSpecialtyName,
    })),
  }));

  return formattedSpecialties;
};

module.exports = {
  specialtyLists,
  specialityEdit,
  getSpecialtyById,
  specialityAdd,
  getSpecialtyByName,
  allList,
  listSpecialties,
  getSubSpecialtiesForSpecialties,
};
