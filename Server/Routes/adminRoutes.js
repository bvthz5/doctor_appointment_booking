const express = require("express");
const router = express.Router();
const adminController = require("../Controller/adminController");
const { loginValidator } = require("../Middleware/Validator/loginValidator");
const { validateData, validateForm } = require("../Middleware/Errors/error");
const {authenticateTokenSuperAdmin} = require("../Util/auth");
const { userValidator } = require("../Middleware/Validator/userValidator");

router
  .post(
    "/login",
    loginValidator("login"),
    validateData,
    adminController.adminLogin
  )
  .post("/addAdmin",authenticateTokenSuperAdmin,userValidator("addAdmin"),validateData,adminController.addAdmin)
  .put("/edit/:id",authenticateTokenSuperAdmin,userValidator("addAdmin"),validateData,adminController.editAdmin)
  .get("/list",authenticateTokenSuperAdmin, userValidator("paginationHandler"),validateData,adminController.listAdmin)
  .get("/:id",authenticateTokenSuperAdmin, adminController.adminById)
  .put("/delete/:id",authenticateTokenSuperAdmin, adminController.deleteAdmin)

  .get("/all/list/role",authenticateTokenSuperAdmin, adminController.listAllAdmins)





module.exports = router;
