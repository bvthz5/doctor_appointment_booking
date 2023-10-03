const jwt = require("jsonwebtoken");
const doctorService = require("../Service/doctorService");
const bookingService = require("../Service/bookingService");
const adminService = require("../Service/adminService");

const authenticateTokenDoctor = async (req, res, next) => {
  return authenticateToken(req, res, next, "DOCTOR");
};

const authenticateTokenUser = async (req, res, next) => {
  return authenticateToken(req, res, next, "USER");
};

const authenticateTokenUserDoctor = async (req, res, next) => {
  return authenticateToken(req, res, next);
};

const authenticateTokenSuperAdmin = async (req, res, next) => {
  return authenticateToken(req, res, next, "SUPERADMIN");
};

/**
 * Check if a user with the specified email and role exists.
 *
 * @function
 * @async
 * @param {string} email - The user's email.
 * @param {string} role - The user's role.
 * @returns {Promise<boolean>} - Indicates whether the user exists.
 */
const checkUserExists = async (email, role) => {
  let user;
  if (role === "DOCTOR") {
    user = await doctorService.userExists(email);
  } else if (role === "SUPERADMIN" || role ==="ADMIN") {
    user = await adminService.checkAdminExist(email);
  } else {
    user = await bookingService.userExists(email);
  }
  if (user) {
    return true;
  }
};

/**
 * Middleware for authenticating access tokens.
 *
 * @function
 * @async
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @param {string} requiredRole - The required role for the user.
 * @returns {Promise<void>}
 */
const authenticateToken = async (req, res, next, requiredRole) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!authHeader || !token) {
      return res
        .status(401)
        .send({ errorCode: 1901, message: "Access token not provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).send({
          errorCode: 1903,
          message:
            "Current user doesn’t have permission to perform this action",
        });
      }

      req.user = decoded;
      // Check if the user exists
      const userExists = await checkUserExists(decoded.email, decoded.role);
      if (!userExists) {
        return res
          .status(400)
          .send({ errorCode: 1007, message: "User not found" });
      }

      return next();
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .send({ errorCode: 1907, message: "Authorization token expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .send({ errorCode: 1902, message: "Invalid access token" });
      } else {
        return res
          .status(500)
          .send({ errorCode: 1905, message: "Internal server error" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ errorCode: 1905, message: "Internal server error" });
  }
};

const adminOrSuperAdminAuthenticateToken = async (req, res, next) => {

  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!authHeader || !token) {
      return res
        .status(401)
        .send({ errorCode: 1901, message: "Access token not provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
      if (decoded.role === "ADMIN" || decoded.role === "SUPERADMIN") {
        req.user = decoded;
        // Check if the user exists
        const userExists = await checkUserExists(decoded.email, decoded.role);
        if (!userExists) {
                   return res
            .status(400)
            .send({ errorCode: 1007, message: "User not found" });
        }
      }else{
        return res.status(403).send({
          errorCode: 1903,
          message:
            "Current user doesn’t have permission to perform this action",
        });
      }

    

      return next();
    } catch (error) {
      console.log(error);
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .send({ errorCode: 1907, message: "Authorization token expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res
          .status(401)
          .send({ errorCode: 1902, message: "Invalid access token" });
      } else {
        return res
          .status(500)
          .send({ errorCode: 1905, message: "Internal server error" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .send({ errorCode: 1905, message: "Internal server error" });
  }
};

/**
 * Generates access and refresh tokens based on user information and role.
 *
 * @function
 * @async
 * @param {Object} user - The user object containing user information.
 * @param {string} role - The role associated with the user.
 * @returns {Promise<{ accessTokenSign: string, refreshTokenSign: string }>} - A Promise that resolves to an object containing the generated access and refresh tokens.
 */
const generateTokenValues = async (user, role) => {
  const accessTokenSign = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: role,
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  const refreshTokenSign = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: role,
      purpose: "REFRESH_TOKEN",
    },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  return { accessTokenSign, refreshTokenSign };
};

/**
 * Function to generate random password
 * @returns generated random password
 */
const generatePassword = async () => {
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numberChars = "0123456789";
  const specialChars = "!@#$%^&*()_-+=[]{}|:;<>,.?";
  const allChars = lowercaseChars + uppercaseChars + numberChars + specialChars;
  let password = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  } // Make sure the password contains at least one lowercase, one uppercase, one number, and one special character
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_\-=\[\]{}|:;<>,.?]/.test(password);
  if (!hasLowercase || !hasUppercase || !hasNumber || !hasSpecialChar) {
    // If any requirement is not met, generate the password again
    return generatePassword();
  }
  return password;
};

module.exports = {
  adminOrSuperAdminAuthenticateToken,
  authenticateToken,
  authenticateTokenUser,
  authenticateTokenUserDoctor,
  generateTokenValues,
  authenticateTokenDoctor,
  authenticateTokenSuperAdmin,
  generatePassword,
};
