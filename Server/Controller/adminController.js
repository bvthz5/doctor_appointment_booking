const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const adminService = require("../Service/adminService");
const { generatePassword } = require("../Util/auth");
const { sendGeneratedPassword } = require("../Util/mail");
const { tryCatch } = require("../Middleware/Errors/tryCatch");

/**
 * Function for admin login.This function will validate email and password from from db and create accesstoken and refresh token
 * @param {*} req
 * @param {*} res
 * @returns
 */
const adminLogin = async (req, res) => {
  logger.info(`Incoming request URL: ${req.url}`);

  try {
    //check if user exists or not
    const user = await adminService.checkAdminExist(req.body.email);
    if (!user) {
      return res
        .status(400)
        .send({ errorCode: 1007, message: "User not found" });
    }

    //compare password in database and requested password
    const match = await bcrypt.compare(
      req.body.password,
      user.dataValues.password
    );
    if (match) {
      const accessTokenSign = jwt.sign(
        {
          id: user.dataValues.id,
          email: user.dataValues.email,
          role: user?.dataValues?.role === 2 ? "SUPERADMIN" : "ADMIN",
        },
        process.env.ACCESS_TOKEN_KEY,
        { expiresIn: "1d" }
      );

      const refreshTokenSign = jwt.sign(
        {
          id: user.dataValues.id,
          email: user.dataValues.email,
          role: user?.dataValues?.role === 2 ? "SUPERADMIN" : "ADMIN",
        },
        process.env.REFRESH_TOKEN_KEY,
        { expiresIn: "7d" }
      );

      res.send({
        accessToken: accessTokenSign,
        refreshToken: refreshTokenSign,
        userDetails: user.dataValues,
      });
    } else {
      res.status(400).send({ errorCode: 1003, message: "Incorrect password" });
    }
  } catch (err) {
    res
      .status(500)
      .send({ errorCode: 1905, message: "An unexpected error occured" });
  }
};
/**
 * Function to add admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const addAdmin = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);

  try {
    const user = await adminService.adminExist(req?.body?.email);

    if (user) {
      return res
        .status(400)
        .send({ errorCode: 1032, message: "Email already exists" });
    } else {
      const password = await generatePassword();

      const passwordHash = await bcrypt.hash(password, 10);
      const data = {
        email: req?.body?.email,
        password: passwordHash,
        name: req?.body?.name,
        status: 1,
        role: 1,
      };
      await adminService.adminAdd(data);
      sendGeneratedPassword(req?.body?.email, password);
      res.send({ message: "Admin added successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Function to edit admin details
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
const editAdmin = async (req, res, next) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const adminId = req.params.id;

  try {
    const user = await adminService.getAdminById(adminId);

    if (!user) {
      return res
        .status(400)
        .send({ errorCode: 1032, message: "User not found" });
    } else if (user?.dataValues?.role == 1) {
      const data = {
        email: req?.body?.email,
        name: req?.body?.name,
      };
      await adminService.editAdmin(data, adminId);
      res.send({ message: "Admin Edited successfully" });
    } else {
      return res
        .status(400)
        .send({ errorCode: 1099, message: "Cannot edit Super Admin" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};
/**
 * Function to list all admins
 * @param {*} req
 * @param {*} res
 */

const listAdmin = async (req, res) => {
  logger.info(`Incoming  URL: ${req.url}`);

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    const { items, count } = await adminService.adminList(page, limit, search);

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
    logger.info("Admin Listed");
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const adminById = async (req, res) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const adminId = req.params.id;

  try {
    const user = await adminService.getAdminById(adminId);

    if (!user) {
      return res
        .status(400)
        .send({ errorCode: 1032, message: "User not found" });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const deleteAdmin = async (req, res) => {
  logger.info(`Incoming  URL: ${req.url}`);
  const adminId = req.params.id;

  try {
    const user = await adminService.getAdminById(adminId);

    if (!user) {
      return res
        .status(400)
        .send({ errorCode: 1032, message: "User not found" });
    } else {
      const data = {
        status: 0,
      };
      await adminService.editAdmin(data, adminId);
      res.send({ message: "User deleted successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

const listAllAdmins = tryCatch(async (req, res) => {
  const adminList = await adminService.listAdminsByStatusAndRole();
  if (!adminList) {
    logger.warn("Admins not found");
    return res
      .status(404)
      .json({ errorCode: "1032", message: "User not found" });
  }
  logger.info("Admins Listed");
  return res.status(200).json(adminList);
});

module.exports = {
  deleteAdmin,
  adminById,
  editAdmin,
  listAdmin,
  adminLogin,
  addAdmin,
  listAllAdmins,
};
