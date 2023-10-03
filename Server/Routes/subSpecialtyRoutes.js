const express = require("express");
const controller = require("../Controller/usersController");
const subSpecialtyController= require("../Controller/subspecialtyController")
const   router = express.Router();
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const { userValidator } = require("../Middleware/Validator/userValidator");
const { validateData } = require("../Middleware/Errors/error");
const { adminOrSuperAdminAuthenticateToken } = require("../Util/auth");
const { specialtyValidator } = require("../Middleware/Validator/specialtyValidator");

/**
 * @swagger
 * /subspecialty/list/{id}:
 *   get:
 *     summary: Get a paginated list of subspecialties for a given specialty ID
 *     description: Get a paginated list of subspecialties for a specific specialty.
 *     tags: [Subspecialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the specialty for which to retrieve subspecialties.
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
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *         description: The type of facility (0 for hospital or 1 for specialty, default is 1).
 *     responses:
 *       200:
 *         description: A paginated list of subspecialties for the specialty with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subspecialty'
 *                 count:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 specialtyId:
 *                   type: integer
 *                 type:
 *                   type: integer
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                 message:
 *                   type: string
 *       404:
 *         description: Specialty not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get(
  "/list/:id",
  userValidator("paginationHandler"),
  validateIdMiddleware,
  validateData,
  controller.getAllSubSpecialty
);

/**
 * @swagger
 * /subspecialty/{id}:
 *   get:
 *     summary: Get the details of a subspecialty by its ID
 *     description: Get the details of a subspecialty based on its ID.
 *     tags: [Subspecialties]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the subspecialty to retrieve details for.
 *     responses:
 *       200:
 *         description: The details of the subspecialty with the given ID.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubSpecialty'
 *       404:
 *         description: Subspecialty not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errorCode:
 *                   type: string
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  validateIdMiddleware,
  validateData,
  controller.subSpecialtyDetailView
).post("/add",adminOrSuperAdminAuthenticateToken,specialtyValidator("addSubSpecialty"),validateData,subSpecialtyController.addSubSpeciality)
.put("/edit/:id",adminOrSuperAdminAuthenticateToken,specialtyValidator("addSubSpecialty"),validateData,subSpecialtyController.editSubSpeciality)
.put("/delete/:id",adminOrSuperAdminAuthenticateToken,subSpecialtyController.deleteSubSpecialty)
.get("/get/listAll",adminOrSuperAdminAuthenticateToken,userValidator("paginationHandler"),validateData, subSpecialtyController.getAllSubSpecialty)
.get("/all/:hospitalId/:specialtyId",adminOrSuperAdminAuthenticateToken,subSpecialtyController.allSubSpecialties)




module.exports = router;
