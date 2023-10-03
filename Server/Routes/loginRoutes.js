const express = require("express");
const router = express.Router();
const {
  validateData,
  validateContentType,
} = require("../Middleware/Errors/error");
const { loginValidator } = require("../Middleware/Validator/loginValidator");
const loginController = require("../Controller/loginController");
const allowedContentTypes = ["application/json"];

router
  .put(
    "/accessToken",
    validateContentType(allowedContentTypes),
    loginValidator("accessToken"),
    validateData,
    loginController.accessToken
  )
  .put(
    "/forgotPassword",
    validateContentType(allowedContentTypes),
    loginValidator("forgotPassword"),
    validateData,
    loginController.forgotPassword
  )
  .put(
    "/resetPassword",
    validateContentType(allowedContentTypes),
    loginValidator("resetPassword"),
    validateData,
    loginController.resetPassword
  );

module.exports = router;
