const express = require("express");
const controller = require("../Controller/usersController");
const router = express.Router();
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const { userValidator } = require("../Middleware/Validator/userValidator");
const {
  facilityValidator,
} = require("../Middleware/Validator/facilityValidator");
const { validateData } = require("../Middleware/Errors/error");
const { authenticateTokenSuperAdmin } = require("../Util/auth");

/**
 * @swagger
 * /facility/list/{id}:
 *   get:
 *     summary: Get all facilities by ID
 *     description: Get a list of facilities based on the provided ID
 *     tags : [facility]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the specialty or subspecialty
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         description: The page number for pagination
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         description: The maximum number of items to return per page
 *         required: false
 *         schema:
 *           type: integer
 *       - in: query
 *         name: type
 *         description: The type of facility (0 for subspecialty, 1 for specialty, or 2 for hospital)
 *         required: false
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of facilities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Facility'
 *                 count:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       400:
 *         description: Bad request or Facility not found
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
  validateIdMiddleware,
  validateData,
  userValidator("paginationHandler"),
  controller.getAllFacilities
);

/**
 * @swagger
 * /facility/{id}:
 *   get:
 *     summary: Get facility details by ID
 *     description: Get the details of a facility based on the provided ID
 *     tags : [facility]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the facility
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully retrieved the facility details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Facility'
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
 *       500:
 *         description: Internal server error
 *       404:
 *         description: Facility not found
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
router.get("/:id", validateIdMiddleware, controller.facilityDetailView);
router.get(
  "/list/admin/all",
  authenticateTokenSuperAdmin,
  controller.getAllFacilityList
);
router.post(
  "/add",
  authenticateTokenSuperAdmin,
  facilityValidator("addFacility"),
  validateData,
  controller.addFacility
);
router.put(
  "/update/:id",
  authenticateTokenSuperAdmin,
  facilityValidator("addFacility"),
  validateData,
  controller.updateFacility
);
router
  .put("/delete/:id", authenticateTokenSuperAdmin, controller.deleteFacility)

  .get("/all/list",authenticateTokenSuperAdmin, controller.listFacilities);

module.exports = router;
