const express = require("express");
const controller = require("../Controller/usersController");
const specialtyController = require("../Controller/specilityController")
const router = express.Router();
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const { userValidator } = require("../Middleware/Validator/userValidator");
const { validateData } = require("../Middleware/Errors/error");
const { specialtyValidator } = require("../Middleware/Validator/specialtyValidator");
const { adminOrSuperAdminAuthenticateToken, authenticateTokenSuperAdmin } = require("../Util/auth");

/**
 * @swagger
 * /specialty/list/{id}:
 *   get:
 *     summary: Get a paginated list of specialties for a given hospital ID
 *     description: Get a paginated list of specialties for a specific hospital.
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the hospital for which to retrieve specialties.
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
 *         description: A paginated list of specialties for the hospital with the given ID.
 *       400:
 *         description: Bad request
 *       404:
 *         description: Hospital not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/list/:id",
  userValidator("paginationHandler"),
  validateIdMiddleware,
  validateData,
  controller.getAllSpecialtyList
);

/**
 * @swagger
 * /specialty/{id}:
 *   get:
 *     summary: Get the details of a specialty by its ID
 *     description: Get the details of a specialty based on its ID.
 *     tags: [Specialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the specialty to retrieve details for.
 *     responses:
 *       200:
 *         description: The details of the specialty with the given ID.
 *       404:
 *         description: Specialty not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  validateIdMiddleware,
  validateData,
  controller.specialtyDetailView
)

.get("/",validateData, controller.specialtyList)
.post("/add",adminOrSuperAdminAuthenticateToken,specialtyValidator("addSpecialty"),validateData, specialtyController.addSpeciality)
.put("/edit/:id",adminOrSuperAdminAuthenticateToken,specialtyValidator("addSpecialty"),validateData, specialtyController.editSpeciality)
.put("/delete/:id",adminOrSuperAdminAuthenticateToken, specialtyController.deleteSpeciality)
.get("/get/listAll",adminOrSuperAdminAuthenticateToken,userValidator("paginationHandler"),validateData, specialtyController.getAllSpecialty)
.get("/all/list/:id",adminOrSuperAdminAuthenticateToken,specialtyController.allSpecialties)

.get("all/list",specialtyController.specialty)
.get("/subspecialty/list",authenticateTokenSuperAdmin,specialtyController.getAllSpecialtiesAndSubSpecialties)






module.exports = router;
