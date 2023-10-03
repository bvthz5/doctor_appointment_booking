const express = require("express");
const controller = require("../Controller/leaveController");
const router = express.Router();
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const { authenticateTokenDoctor, authenticateTokenSuperAdmin } = require("../Util/auth");
const {
  validateData,
  validateContentType,
} = require("../Middleware/Errors/error");
const { leaveValidator } = require("../Middleware/Validator/leaveValidators");
const { userValidator } = require("../Middleware/Validator/userValidator");
const allowedContentTypes = ["application/json"];

router
  .post(
    "/leave",
    authenticateTokenDoctor,
    validateContentType(allowedContentTypes),
    leaveValidator("leave"),
    validateData,
    controller.changeLeaveStatus
  )

  .get(
    "/leaveList",
    userValidator("paginationHandler"),
    controller.listAllLeaves
  )

  .get(
    "/leave/getAll",
    authenticateTokenSuperAdmin,
    userValidator("paginationHandler"),
    controller.listAllLeaves
  )

  .put(
    "/deleteLeave/:id",
    authenticateTokenDoctor,
    validateIdMiddleware,
    validateData,
    controller.DeleteLeave
  )
  .get(
    "/timeSlot/:id",
    authenticateTokenDoctor,
    validateIdMiddleware,
    leaveValidator("AvailableTimeSlots"),
    validateData,
    controller.listAvailableTimeSlots
  );

module.exports = router;
