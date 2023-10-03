const express = require("express");
const router = express.Router();
const packageController = require("../Controller/packageController");
const { authenticateTokenUser, adminOrSuperAdminAuthenticateToken } = require("../Util/auth");
const { packageValidator } = require("../Middleware/Validator/idValidator");
const {
  validateData,
  validateContentType,
} = require("../Middleware/Errors/error");
const { userValidator } = require("../Middleware/Validator/userValidator");
const allowedContentTypes = ["application/json"];

router
  .post(
    "/buy",
    authenticateTokenUser,
    validateContentType(allowedContentTypes),
    packageValidator("addPackage"),
    validateData,
    packageController.buyPackage
  )
  .get("/users", authenticateTokenUser, packageController.userPackages)
  .get("/hospital/:hospitalId",userValidator('paginationHandler'),validateData, packageController.hospitalPackages)
  .get("/",adminOrSuperAdminAuthenticateToken,packageController.getAllPackages)
  .post("/",adminOrSuperAdminAuthenticateToken,packageValidator('addNew'),validateData,packageController.addNewPackage)
  .put("/:id",adminOrSuperAdminAuthenticateToken,packageValidator('addNew'),validateData,packageController.editPackage)
  .delete("/:id",adminOrSuperAdminAuthenticateToken,packageController.deletePackage)

module.exports = router;
