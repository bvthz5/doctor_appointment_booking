const { Op } = require("sequelize");
const SubSpecialty = require("../Model/subSpecialtyModel");
const { COMMON_STATUS } = require("../Util/constants");
const Specialty = require("../Model/specialtyModel");
const SpecialtyHospital = require("../Model/specialtyHospitalModel");
const {createCustomError} = require("../Middleware/Errors/errorHandler");


/**
 * Funtion to add subspecialty details to subspecialty table
 * @param {object} data - details of the sub specialty to added
 */
const subSpecialtyAdd = async (data) => {
  await SubSpecialty.create(data);
};

/**
 * Function get the details of a subspecialty by passing it id
 * @param {number} id - id of the subspecialty that details need  to be fetched
 * @returns the details of the sub specialty
 */
const subSpecialtyById = async (id) => {
  const subspeciality = await SubSpecialty.findOne({
    where: {
      id: id,
      status: COMMON_STATUS.ACTIVE,
    },
  });
  return subspeciality;
};

/**
 * Function to update the details of subspecialty
 * @param {*} data - updated details of the specific subspecialty
 * @param {*} id - id of the subspecialty that need to updated
 */
const updateSubSpecialty = async (data, id) => {
  await SubSpecialty.update(data, {
    where: {
      id: id,
    },
  });
};

/**
 * Retrieve a list of sub-specialties with optional pagination, search, and filter by specialty.
 *
 * @async
 * @function subSpecialtyLists
 * @param {number} page - The current page of results (default: 1).
 * @param {number} limit - The number of results per page (default: 10).
 * @param {string} search - A search query to filter results (optional).
 * @param {number} specialtyId - An ID to filter results by specialty (optional).
 * @throws {Error} If an error occurs while fetching the sub-specialties.
 * @returns {Promise<{items: object[], count: number}>} An object containing the list of sub-specialties and the total count.
 */

const subSpecialtyLists = async (page, limit, search, specialtyId) => {
  let whereClause = {
    status: COMMON_STATUS.ACTIVE,
  };
  if (search) {
    whereClause.SubSpecialtyName = { [Op.like]: `%\\${search}%` };
  }
  if (specialtyId) {
    whereClause.specialtyId = specialtyId;
  }
  const list = await SubSpecialty.findAndCountAll({
    limit: limit,
    offset: (page - 1) * limit,
    where: whereClause,
    include: [{ model: Specialty }],
  });

  return {
    items: list.rows,
    count: list.count,
  };
};


const specialtyExists = async (specialtyId) => {
  const specialty = await Specialty.findOne({
    where: { id: specialtyId, status: COMMON_STATUS.ACTIVE },
  });
  if(!specialty){
    // Create custom error
    const error = createCustomError("Specialty not found", 404);
    throw error;
  }
  return specialty
};

const allSubSpecialtyLists = async(hospitalId,specialtyId)=>{
  const allSubSpecialties = await SpecialtyHospital.findAll({
    where: { hospitalId: hospitalId,specialtyId : specialtyId, status: COMMON_STATUS.ACTIVE },
    attributes: ["subspecialtyId"],
    include: [{ model: SubSpecialty ,attributes:['id','SubSpecialtyName']}],
  });
  console.log(allSubSpecialties);
  if(allSubSpecialties.length == 0){
     // Create custom error
     const error = createCustomError("Hospital is not reside with this specialty", 400);
     throw error;
    
  }
  const formattedResponse = allSubSpecialties?.map((item) => ({
    id: item?.subspecialty?.id,
    subSpecialtyName: item?.subspecialty?.SubSpecialtyName,
  }));
  return formattedResponse; 

}

module.exports = {
  subSpecialtyLists,
  updateSubSpecialty,
  subSpecialtyById,
  subSpecialtyAdd,
  allSubSpecialtyLists,
  specialtyExists
};
