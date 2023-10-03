const Admin = require("../Model/adminsModel");
const Hospital = require("../Model/hospitalModel");
const SpecialityHospital = require("../Model/specialtyHospitalModel");
const sequelize = require("../database");
const { Op, where } = require("sequelize");
const { COMMON_STATUS } = require("../Util/constants");
const FacilityHospital = require("../Model/facilityHospitalModel");
const ServiceHospitals = require("../Model/serviceHospitalModal");

/**
 * Function to get the list of hospitals
 * @param {*} page - page number fetch data
 * @param {*} limit - value to determine how many data is need to fetched
 * @param {*} search - value to search by email or name
 * @returns  hospitalList
 */
const getAllHospitals = async (page, limit, search) => {
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
    order: [["bookingCount", "DESC"]], // Sort based on highest booking count
    limit: limit,
    offset: (page - 1) * limit,
    include: [
      {
        model: Admin, // Include the Admin model
        attributes: ["email", "name", "role"],
      },
    ],
  });

  const totalRecords = await Hospital.count({ where: filterCriteria });

  // Calculate hasPrevious based on the current page
  const hasPrevious = page > 1;

  return { hospitals, totalRecords, hasPrevious };
};

/**
 * Function to getdetails of hospital
 * @param {string} email - email to check hospital exist
 * @returns
 */
const getHospitalByEmail = async (email) => {
  const hospital = await Hospital.findOne({
    where: {
      email: email,
      status: 1,
    },
  });
  return hospital;
};

/**
 * Function to add hospital details to hospital table
 * @param {*} data
 */
const addHospital = async (data) => {
  await Hospital.create(data);
};

const editHospital = async (data, hospitalId) => {
  await Hospital.update(data, {
    where: {
      id: hospitalId,
    },
  });
};

const addSpecialityHospital = async (data) => {
  await SpecialityHospital.create(data);
};

const addFacilityHospitals = async (data) => {
  await FacilityHospital.create(data);
};

const addServiceHospitals = async (data) => {
  await ServiceHospitals.create(data);
};

const getHospitalById = async (id) => {
  const hospital = await Hospital.findOne({
    where: {
      id: id,
      status: COMMON_STATUS.ACTIVE,
    },
  });
  return hospital;
};

const getSubspecilityIdbySpecialty = async (specialityId) => {
  const list = await SpecialityHospital.findOne({
    where: {
      specialtyId: specialityId,
      status: COMMON_STATUS.ACTIVE,
    },
  });

  return list;
};

const getspecilityHospitalbySubSpecialty = async (id) => {
  const list = await SpecialityHospital.findOne({
    where: {
      subspecialtyId: id,
      status: COMMON_STATUS.ACTIVE,
    },
  });

  return list;
};

const deleteSpecialityHospitalBySpecialtyId = async (specialityId) => {
  await SpecialityHospital.update(
    { status: COMMON_STATUS.INACTIVE },
    { where: { specialtyId: specialityId } }
  );
};

const deleteSpecialityHospitalByHospitalId = async (hospitalId) => {
  await SpecialityHospital.update(
    { status: COMMON_STATUS.INACTIVE },
    {
      where: {
        hospitalId: hospitalId,
      },
    }
  );
};

const FacilityHospitalById = async (hospitalId) => {
  await FacilityHospital.update(
    { status: COMMON_STATUS.INACTIVE },
    {
      where: {
        hospitalId: hospitalId,
      },
    }
  );
};

const ServiceHospitalById = async (hospitalId) => {
  await ServiceHospitals.update(
    { status: COMMON_STATUS.INACTIVE },
    {
      where: {
        hospitalId: hospitalId,
      },
    }
  );
};

const getHospitalByAdminId = async (adminId) => {
  return await Hospital.findOne({
    where: {
      adminId,
      status: COMMON_STATUS.ACTIVE,
    },
  });
};

/**
 * Function to get the details Speciality Hospital By hospitalId,specialityId,subSpecialityId
 */
const getSpecialtyHospitalByHospitalSpecialtySubSpeciality = async (
  hospitalId,
  specialityId,
  subSpecialityId
) => {
  let whereClause = {
    hospitalId: hospitalId,
    specialtyId: specialityId,
    status: COMMON_STATUS.ACTIVE,
  };

  if (subSpecialityId) {
    whereClause.subspecialtyId = subSpecialityId;
  }
  const specialityHospital = await SpecialityHospital.findOne({
    where: whereClause,
  });

  return specialityHospital;
};

/**
 * Function to get the details of  Hospital By hospitalId,adminId
 */
const getHospitalByAdminIdandHospId = async (hospitalId, adminId) => {
  const specialityHospital = await Hospital.findOne({
    where: {
      hospitalId: hospitalId,
      adminId: adminId,
    },
  });
  return specialityHospital;
};




module.exports = {
  getspecilityHospitalbySubSpecialty,
  getSubspecilityIdbySpecialty,
  getHospitalByAdminIdandHospId,
  getSpecialtyHospitalByHospitalSpecialtySubSpeciality,
  getHospitalByAdminId,
  deleteSpecialityHospitalByHospitalId,

  deleteSpecialityHospitalBySpecialtyId,
  editHospital,

  getHospitalById,
  addSpecialityHospital,
  addHospital,
  getHospitalByEmail,
  getAllHospitals,
  addFacilityHospitals,
  addServiceHospitals,
  FacilityHospitalById,
  ServiceHospitalById,
};
