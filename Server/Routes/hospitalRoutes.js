const express = require("express");
const controller = require("../Controller/usersController");
const hospitalController = require("../Controller/hospitalController");
const router = express.Router();
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const { userValidator } = require("../Middleware/Validator/userValidator");
const {
  validateData,
  validateContentType,
} = require("../Middleware/Errors/error");
const allowedTypes = ["multipart/form-data"];
const { authenticateTokenSuperAdmin, adminOrSuperAdminAuthenticateToken } = require("../Util/auth");
const { handleMulterError, upload } = require("../Util/fileUpload");

/**
 * @swagger
 * /hospitals/{id}:
 *   get:
 *     summary: Get details of a hospital by its ID
 *     description: Get the details of a hospital based on its ID.
 *     tags: [Hospitals]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the hospital to retrieve details for.
 *     responses:
 *       200:
 *         description: The details of the hospital with the given ID.
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", validateIdMiddleware, validateData, controller.hospitalList);

router.get(
  "/get/:id",
  authenticateTokenSuperAdmin,
  validateIdMiddleware,
  validateData,
  hospitalController.getHospitalDetails
);

/**
 * @swagger
 * /hospitals:
 *   get:
 *     summary: Get a paginated list of all hospitals
 *     description: Get a paginated list of all hospitals.
 *     tags: [Hospitals]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The number of items per page (default is 10).
 *     responses:
 *       200:
 *         description: A paginated list of all hospitals.
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  userValidator("paginationHandler"),
  controller.getAllHospitalView
);

router.get("/count/all", controller.getAllCounts);
router.post(
  "/add",
  validateContentType(allowedTypes),
  authenticateTokenSuperAdmin,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) {
        return handleMulterError(err, req, res, next);
      }
      next();
    });
  },
  hospitalController.addHospital
);
router
  .put(
    "/edit/:id",
    validateContentType(allowedTypes),
    authenticateTokenSuperAdmin,
    (req, res, next) => {
      upload.single("file")(req, res, function (err) {
        if (err) {
          return handleMulterError(err, req, res, next);
        }
        next();
      });
    },
    hospitalController.editHospital
  )
  .put(
    "/delete/:id",
    authenticateTokenSuperAdmin,
    hospitalController.deleteHospital
  )

  .get(
    "/list/allHospital", 
    authenticateTokenSuperAdmin,
    userValidator("paginationHandler"),
    hospitalController.getAllHospitalList
  )
  .get("/all/list",authenticateTokenSuperAdmin,hospitalController.hospitalList)
  .get("/admin/hospital",adminOrSuperAdminAuthenticateToken,hospitalController.getHospitalName)

module.exports = router;
