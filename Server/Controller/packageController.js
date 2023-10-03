const packageService = require("../Service/packageService");
const logger = require("../logger");
const { COMMON_STATUS } = require("../Util/constants");
const { getHospital } = require("../Service/adminService");

/**
 * Handles the process of purchasing a package.
 *
 * @function
 * @async
 * @param {Object} req - Express request object containing the package details and user information.
 * @param {Object} res - Express response object to send the response.
 * @param {Function} next - The next middleware function.
 */
const buyPackage = async (req, res, next) => {
  try {
    //checks if the package exists or not
    await packageService.getById(req.body.packageId);
    const data = {
      packageId: req.body.packageId,
      userId: req.user.id,
      status: COMMON_STATUS.ACTIVE,
    };
    //checks the user have any package and add new package to user
    await packageService.getAndBuyPackage(
      req.user.id,
      req.body.packageId,
      data
    );
    res.send({ message: "Package added successfully" });
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Get the list of packages owned by a user.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const userPackages = async (req, res, next) => {
  try {
    const packages = await packageService.packageList(req.user.id);
    res.send(packages);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

/**
 * Get the list of packages associated with a hospital.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {function} next - The next middleware function.
 * @returns {void}
 */
const hospitalPackages = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    await packageService.getHospitalId(req.params.hospitalId);
    const { items, count } = await packageService.getHospitalPackage(
      req.params.hospitalId,
      limit,
      page
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
    res.send(response);
  } catch (err) {
    logger.error(`Error occurred: ${err.message}`);
    next(err);
  }
};

const getAllPackages = async (req, res, next) => {
  let hospitalId = req.query.hospitalId;
  const page= parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const search = req.query.search
  try {
    if (req.user.role === "ADMIN") {
      hospitalId = await getHospital(req.user.id)
    }
    const {items,count} = await packageService.allPackages(page,limit,search,hospitalId);

    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const response = {
      items,
      count,
      hasNext,
      currentPage: page,
      totalPages,
    };
    res.send(response);
  } catch (err) {
    console.log(err);
    next(err);
  }
};


const addNewPackage = async(req,res,next) => {
  try{
    let hospitalId;
    if(req.user.role === "SUPERADMIN"){
      if(!req.body.hospital){
        return res.status(400).send({errorCode : 1158,message : "Hospital id is required"})
      }else{
        hospitalId = req.body.hospital
        await packageService.getHospitalId(hospitalId)
      }
    }else{
      hospitalId = await getHospital(req.user.id)
    }
    const data = {
      hospitalId : hospitalId,
      packageName : req.body.name,
      price : req.body.price,
      off : req.body.offer,
      validity : req.body.validity,
      status : COMMON_STATUS.ACTIVE,
      version : 1
    }
    await packageService.addPackage(data)
    res.send({message : "Package added successfully"})

  }catch(err){
    next(err)
  }
}

const editPackage = async(req,res,next) => {
  try{
    await packageService.getById(req.params.id)
    let hospitalId;
    if(req.user.role === "SUPERADMIN"){
      if(!req.body.hospital){
        return res.status(400).send({errorCode : 1158,message : "Hospital id is required"})
      }else{
        hospitalId = req.body.hospital
        await packageService.getHospitalId(hospitalId)
      }
    }else{
      hospitalId = await getHospital(req.user.id)
    }
    const data = {
      hospitalId : hospitalId,
      packageName : req.body.name,
      price : req.body.price,
      off : req.body.offer,
      validity : req.body.validity
    }
    await packageService.updatePackage(data,req.params.id)
    res.send({message : "Package updated successfully"})

  }catch(err){
    next(err)
  }

}

const deletePackage = async(req,res,next)=>{
  try{
    await packageService.getById(req.params.id)
    const data ={
      status : COMMON_STATUS.INACTIVE
    }
    await packageService.getUserPackages(req.params.id)
    await packageService.packageDelete(data,req.params.id)
    res.send({message : "Package deleted successfully"})
  }catch(err){
    console.log(err);
    next(err)
  }
}

module.exports = {
  buyPackage,
  userPackages,
  hospitalPackages,
  getAllPackages,
  addNewPackage,
  editPackage,
  deletePackage
};
