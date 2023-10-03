const express = require('express')
const router = express.Router();
const {upload,handleMulterError} = require('../Util/fileUpload')
const { validateData,validateContentType } = require('../Middleware/Errors/error')
const { loginValidator } = require('../Middleware/Validator/loginValidator')
const doctorController = require('../Controller/doctorController')
const {authenticateTokenDoctor} = require('../Util/auth');
const { doctorValidator } = require('../Middleware/Validator/doctorValidator');
const { userValidator } = require('../Middleware/Validator/userValidator');
const allowedContentTypes = ['application/json'];
const allowedTypes = ['multipart/form-data'];




router.post('/login',validateContentType(allowedContentTypes), loginValidator('login'),validateData, doctorController.doctorLogin)

.get('/profile',authenticateTokenDoctor,doctorController.doctorDetails)

.put('/update',validateContentType(allowedTypes), authenticateTokenDoctor, (req, res, next) => {
    upload.single('file')(req, res, function (err) {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },doctorValidator('profileUpdate'),validateData,doctorController.updateProfile)

.get('/list',doctorValidator('pagination'),validateData,doctorController.getAllDoctors)
.get('/doctorlist',doctorValidator('doctorpagination'),validateData,doctorController.getDoctorsList)


.get('/view/:id',doctorController.doctorView)
.get('/details/:id',doctorController.getDoctorDetails)
.put('/delete/:id',doctorController.deleteDoctor)


.get('/famousDoctors',userValidator('paginationHandler'),validateData, doctorController.doctorsList)

.post('/history',authenticateTokenDoctor, validateContentType(allowedContentTypes),doctorValidator('addDiagnosticHistory'),validateData,doctorController.addDiagnosticHistory)
.post('/add',validateContentType(allowedTypes),  (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
},doctorValidator('addDoctor'),validateData,doctorController.addDoctor)
.put('/edit/:id',validateContentType(allowedTypes),  (req, res, next) => {
  upload.single('file')(req, res, function (err) {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    next();
  });
},doctorValidator('editDoctor'),validateData,doctorController.editDoctor)

module.exports = router   