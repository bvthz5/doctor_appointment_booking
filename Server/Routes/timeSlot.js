const express = require("express");
const { authenticateTokenSuperAdmin, adminOrSuperAdminAuthenticateToken } = require("../Util/auth");
const router = express.Router();
const timeslotController = require("../Controller/timeSlotController");
const { timeValidator } = require("../Middleware/Validator/timeValidator");
const { validateData } = require("../Middleware/Errors/error");


router.get('/',authenticateTokenSuperAdmin,timeslotController.getAllTimeSlots)
.post('/',authenticateTokenSuperAdmin,timeValidator("addTime"),validateData,timeslotController.addTimeSlot)
.get("/hospital",adminOrSuperAdminAuthenticateToken,timeslotController.hospitalTimeSlots)
.post("/hospital",adminOrSuperAdminAuthenticateToken,timeValidator('hospitalTimeSlots'),validateData,timeslotController.addHospitalTimeSlots)
.get("/doctors",adminOrSuperAdminAuthenticateToken,timeslotController.doctorTimeslots)





module.exports = router;
