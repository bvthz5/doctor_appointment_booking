const hospitalService = require("../Service/hospitalService");
const logger = require("../logger");
const adminService = require("../Service/adminService");
const {
  getSpecialtyDetail,
  getSubSpecialtybySpecialityId,
  getFacilityId,
  getServiceById,
  allHospital,
  getHospitalDetail,
} = require("../Service/usersService");
const sequelize = require("../database");
const { getDifferenceArray, filterUnique } = require("../Util/common");
const { COMMON_STATUS } = require("../Util/constants");
const { deleteUploadedFile } = require("../Util/fileUpload");
const { tryCatch } = require("../Middleware/Errors/tryCatch");
const { check } = require("express-validator");
const { createCustomError } = require("../Middleware/Errors/errorHandler");

const getAllHospitalList = tryCatch(async (req, res) => {
  // Parse pagination parameters from the request query
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || null;

  // Call the service method to get hospitals with pagination
  const { hospitals, totalRecords, hasPrevious } =
    await hospitalService.getAllHospitals(page, limit, search);

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
 * Function to add Hospital
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const addHospital = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  console.log(req.body, req.file, "h");
  const t = await sequelize.transaction();
  console.log(req.body);
  try {
    const hospital = await hospitalService.getHospitalByEmail(req?.body?.email);

    if (hospital) {
      await t.rollback();
      return res
        .status(400)
        .send({ errorCode: 1032, message: "Email already exists" });
    }

    const admin = await adminService.getAdminById(req?.body?.adminId);

    if (!admin) {
      await t.rollback();
      return res
        .status(400)
        .send({ errorCode: 1032, message: "User not found" });
    }

    const ifAdminAssigned = await hospitalService.getHospitalByAdminId(
      req?.body?.adminId
    );
    if (ifAdminAssigned) {
      await t.rollback();
      return res.status(400).send({
        errorCode: 1093,
        message: "Admin already assigned to a hospital",
      });
    }

    const specialities = JSON.parse(req.body.speciality);
    await checkSpecialtyExist(specialities, res, t);

    const serviceIds = JSON.parse(req.body.serviceId);
    await checkServiceExist(serviceIds, res, t);

    const facilityIds = JSON.parse(req.body.facilityId);
    await checkFacilityExist(facilityIds, res, t);

    const data = {
      email: req?.body?.email,
      address: req?.body?.address,
      name: req?.body?.name,
      contactNo: req?.body?.contactNo,
      adminId: req?.body?.adminId,
      city: req?.body?.city,
      status: COMMON_STATUS.ACTIVE,
      role: 1,
    };

    if (req?.file?.key) {
      data.imageKey = req.file.key;
    }

    await hospitalService.addHospital(data, { transaction: t });
    const createdHospital = await hospitalService.getHospitalByEmail(
      req?.body?.email
    );
    const hospitalId = createdHospital?.dataValues?.id;

    addSpecialityHospital(specialities, hospitalId, t);
    addServiceHospital(serviceIds, hospitalId, t);
    addFacilityHospital(facilityIds, hospitalId, t);

    await t.commit();
    res.send({ message: "Hospital Added successfully" });
  } catch (error) {
    if (t.finished !== "rollback") {
      await t.rollback();
    }

    console.log(error);
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const getHospitalDetails = async (req, res) => {
  try {
    const hospitalId = req.params.id;
    const hospitalDetails = await getHospitalDetail(hospitalId);
    res.status(200).json(hospitalDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteHospital = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const hospitalId = req.params.id;

  try {
    const hospital = await hospitalService.getHospitalById(hospitalId);

    if (!hospital) {
      return res
        .status(400)
        .send({ errorCode: 1032, message: "Hospital not found" });
    } else {
      const data = {
        status: COMMON_STATUS.INACTIVE,
      };
      await hospitalService.editHospital(data, hospitalId);
      res.send({ message: "Hospital deleted successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Function to edit hospital details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const editHospital = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const hospitalId = req.params.id;
  const t = await sequelize.transaction();
  try {
    const hospital = await hospitalService.getHospitalById(hospitalId);
    if (!hospital) {
      await t.rollback();
      return res
        .status(400)
        .send({ errorCode: 1032, message: "Hospital not found" });
    } else {
      const admin = await adminService.getAdminById(req?.body?.adminId);

      if (!admin) {
        await t.rollback();
        return res
          .status(400)
          .send({ errorCode: 1032, message: "User not found" });
      } else {
        const ifAdminAssigned = await hospitalService.getHospitalByAdminId(
          req?.body?.adminId
        );

        if (ifAdminAssigned && ifAdminAssigned?.id!=hospitalId) {
          await t.rollback();
          return res.status(400).send({
            errorCode: 1099,
            message: "Admin already assigned to hospital",
          });
        } else {
          const specialities = JSON.parse(req.body.speciality);
          await checkSpecialtyExist(specialities, res, t);

          const serviceIds = JSON.parse(req.body.serviceId);
          await checkServiceExist(serviceIds, res, t);

          const facilityIds = JSON.parse(req.body.facilityId);
          await checkFacilityExist(facilityIds, res, t);

          const data = {
            email: req?.body?.email,
            address: req?.body?.address,
            name: req?.body?.name,
            contactNo: req?.body?.contactNo,
            adminId: req?.body?.adminId,
            city: req?.body?.city,
          };
          if (req?.file?.key) {
            data.imageKey = req.file.key;
            hospital?.dataValues.imageKey &&
              deleteUploadedFile(hospital?.dataValues?.imageKey);
          }
          await hospitalService.editHospital(data, hospitalId, {
            transaction: t,
          });

          await hospitalService.deleteSpecialityHospitalByHospitalId(
            hospitalId,
            { transaction: t }
          );
          await hospitalService.FacilityHospitalById(
            hospitalId,
            { transaction: t }
          );
          await hospitalService.ServiceHospitalById(
            hospitalId,
            { transaction: t }
          );

          addSpecialityHospital(specialities, hospitalId, t);
          addServiceHospital(serviceIds, hospitalId, t);
          addFacilityHospital(facilityIds, hospitalId, t);
          await t.commit();
          res.send({ message: "Hospital updated successfully" });
        }
      }
    }
  } catch (error) {
    if (req?.file?.key) {
      deleteUploadedFile(req?.file?.key);
    }
    await t.rollback();
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

function addSpecialityHospital(specialities, hospitalId, t) {
  specialities?.forEach(async (speciality) => {
    if (speciality?.subspecialities?.length > 0) {
      console.log(speciality);
      speciality?.subspecialities?.forEach(async (subSpeciality) => {
        await hospitalService.addSpecialityHospital(
          {
            hospitalId: hospitalId,
            specialtyId: speciality?.specialityId,
            subspecialtyId: subSpeciality,
            status: COMMON_STATUS.ACTIVE,
          },
          { transaction: t }
        );
      });
    } else {
      await hospitalService.addSpecialityHospital(
        {
          hospitalId: hospitalId,
          specialtyId: speciality?.specialityId,
          status: COMMON_STATUS.ACTIVE,
        },
        { transaction: t }
      );
    }
  });
}

async function addServiceHospital(services, hospitalId, t) {
  try {
    for (const serviceId of services) {
      if (!isNaN(serviceId) && Number.isInteger(Number(serviceId))) {
        console.log(
          `Adding ServiceHospitals record: hospitalId=${hospitalId}, serviceId=${serviceId}`
        );
        await hospitalService.addServiceHospitals(
          {
            hospitalId: hospitalId,
            serviceId: Number(serviceId),
            status: COMMON_STATUS.ACTIVE,
          },
          { transaction: t }
        );
        console.log(
          `ServiceHospitals record added: hospitalId=${hospitalId}, serviceId=${serviceId}`
        );
      } else {
        console.log(`Invalid serviceId: ${serviceId}`);
      }
    }
  } catch (error) {
    throw error;
  }
}

async function addFacilityHospital(facilities, hospitalId, t) {
  try {
    for (const facilityId of facilities) {
      if (!isNaN(facilityId) && Number.isInteger(Number(facilityId))) {
        console.log(
          `Adding FacilityHospitals record: hospitalId=${hospitalId}, facilityId=${facilityId}`
        );
        await hospitalService.addFacilityHospitals(
          {
            hospitalId: hospitalId,
            facilityId: Number(facilityId),
            status: COMMON_STATUS.ACTIVE,
          },
          { transaction: t }
        );
        console.log(
          `FacilityHospitals record added: hospitalId=${hospitalId}, facilityId=${facilityId}`
        );
      } else {
        console.log(`Invalid facilityId: ${facilityId}`);
      }
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Function to check whether the values os speciality and subspecialty passed through form exist in the db or not
 * @param {*} specialities
 * @param {*} res
 */
async function checkSpecialtyExist(specialities, res, t) {
  try {
    for (const speciality of specialities) {
      const specialty = await getSpecialtyDetail(speciality.specialityId);
      if (!specialty) {
        throw createCustomError("Specialty not found", 404);
      }

      const subspecialties =
        (await getSubSpecialtybySpecialityId(speciality?.specialityId)) || [];
      const subspecialtiesIdList = subspecialties.map((element) => {
        return element?.dataValues?.id;
      });
      const arrayDifference = getDifferenceArray(
        speciality.subspecialities,
        subspecialtiesIdList
      );
      if (arrayDifference?.length !== 0) {
        throw createCustomError("Sub-Specialty not found", 400);
      }
    }
  } catch (error) {
    await t.rollback(); // Rollback the transaction on error
    logger.warn(error.message);
    return res.status(error.status || 500).json({
      errorCode: error.errorCode || "1090",
      message: error.message,
    });
  }
}
async function checkFacilityExist(facilityIds, res, t) {
  try {
    const facilityPromises = facilityIds.map(async (facilityId) => {
      return await getFacilityId(facilityId);
    });

    const facilities = await Promise.all(facilityPromises);

    const missingFacilities = facilities.filter((facility) => !facility);

    if (missingFacilities.length > 0) {
      throw createCustomError("Facility not found", 404);
    }
  } catch (error) {
    // Rollback the transaction on error
    await t.rollback();

    logger.warn(error.message);

    return res.status(error.status || 500).json({
      errorCode: error.errorCode || "10809",
      message: error.message,
    });
  }
}

async function checkServiceExist(serviceIds, res, t) {
  try {
    // Use Promise.all to concurrently fetch and validate service IDs
    const servicePromises = serviceIds.map(async (serviceId) => {
      return await getServiceById(serviceId);
    });

    const services = await Promise.all(servicePromises);

    // Check if any services were not found
    const missingServices = services.filter((service) => !service);

    if (missingServices.length > 0) {
      throw createCustomError("Service not found", 404);
    }
  } catch (error) {
    // Rollback the transaction on error
    await t.rollback();
    logger.warn(error.message);
    return res.status(error.status || 500).json({
      errorCode: error.errorCode || "10808",
      message: error.message,
    });
  }
}


const hospitalList = async(req,res,next) => {
  try{
    const hospitalList = await allHospital()
    res.send(hospitalList)

  }catch(err){
    next(err)
  }

}
const getHospitalName = async(req,res,next) => {
  try{
    const hospital= await hospitalService.getHospitalByAdminId(req.user.id)
    res.send(hospital)

  }catch(err){
    next(err)
  }

}

module.exports = {
  deleteHospital,
  getHospitalDetails,
  editHospital,
  getAllHospitalList,
  addHospital,
  hospitalList,
  getHospitalName
};
