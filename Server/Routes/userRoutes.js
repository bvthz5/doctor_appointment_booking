const express = require("express");
const router = express.Router();
const userController = require("../Controller/usersController");
const { userValidator } = require("../Middleware/Validator/userValidator");
const { authenticateTokenSuperAdmin } = require("../Util/auth");
const { validateData } = require("../Middleware/Errors/error");


router.get("/list",authenticateTokenSuperAdmin, userValidator("paginationHandler"),validateData,userController.getUsersList)
.put("/delete/:id",authenticateTokenSuperAdmin, userController.deleteUser)

module.exports = router;