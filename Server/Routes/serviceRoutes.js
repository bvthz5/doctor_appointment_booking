const express = require("express");
const controller = require("../Controller/usersController");
const router = express.Router();
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const { userValidator } = require("../Middleware/Validator/userValidator");
const { validateData } = require("../Middleware/Errors/error");
const {
  serviceValidator,
} = require("../Middleware/Validator/serviceValidator");
const { authenticateTokenSuperAdmin } = require("../Util/auth");

/**
 * @swagger
 * /service/list/{id}:
 *   get:
 *     summary: Get a paginated list of services based on the provided type and ID
 *     description: Get a paginated list of services based on the given type and ID.
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the specialty or subspecialty to retrieve services for.
 *       - in: query
 *         name: type
 *         schema:
 *           type: integer
 *         required: true
 *         description: The type of service to retrieve (0 for specialty, 1 for subspecialty).
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: The page number for pagination (default is 1).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: The maximum number of items to return per page (default is 10).
 *     responses:
 *       200:
 *         description: A paginated list of services based on the given type and ID.
 *       400:
 *         description: Bad request
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/list/:id",
  userValidator("paginationHandler"),
  validateIdMiddleware,
  validateData,
  controller.getAllService
);

/**
 * @swagger
 * /service/{id}:
 *   get:
 *     summary: Get service details by ID
 *     description: Get the details of a service based on the given ID.
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the service to retrieve details for.
 *     responses:
 *       200:
 *         description: The details of the service with the given ID.
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", validateIdMiddleware, validateData, controller.serviceList);
router.post(
  "/",
  authenticateTokenSuperAdmin,
  serviceValidator("addService"),
  validateData,
  controller.addService
);
router.put(
  "/:id",
  authenticateTokenSuperAdmin,
  serviceValidator("addService"),
  validateData,
  controller.updateService
);
router.get(
  "/",
  authenticateTokenSuperAdmin,
  userValidator("paginationHandler"),
  validateData,
  controller.getAllServiceList
);
router
  .delete("/:id", authenticateTokenSuperAdmin, controller.deleteService)

  .get("/all/list",authenticateTokenSuperAdmin, controller.listServices);

module.exports = router;
