const express = require("express");
const { blogValidator } = require("../Middleware/Validator/blogValidators");
const controller = require("../Controller/blogController");
const {
  validateData,
  validateContentType,
} = require("../Middleware/Errors/error");
const {
  authenticateTokenDoctor,
  adminOrSuperAdminAuthenticateToken,
} = require("../Util/auth");
const router = express.Router();
const { validateIdMiddleware } = require("../Middleware/Validator/idValidator");
const { upload, handleMulterError } = require("../Util/fileUpload");
const { userValidator } = require("../Middleware/Validator/userValidator");
const allowedContentTypes = ["Application/json"];
// route to about the blogs

/**
 * @swagger
 * /blog/add:
 *   post:
 *     summary: Create a new blog
 *     description: Create a new blog post
 *     tags: [Blog]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully created a new blog
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/add",
  authenticateTokenDoctor,
  validateContentType(allowedContentTypes),
  blogValidator("addBlog"),
  validateData,
  controller.createBlog
);

/**
 * @swagger
 * /blog/edit/{id}:
 *   put:
 *     summary: Update a blog by ID
 *     description: Update an existing blog post by its ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the blog post to update
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully updated the blog
 *       400:
 *         description: Bad request
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/edit/:id",
  authenticateTokenDoctor,
  validateContentType(allowedContentTypes),
  blogValidator("addBlog"),
  validateIdMiddleware,
  validateData,
  controller.updateBlog
);

/**
 * @swagger
 * /blog/listAll:
 *   get:
 *     summary: Get a list of all blogs
 *     description: Retrieve a paginated list of all blog posts
 *     tags: [Blog]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: The page number to retrieve (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: The number of blogs to retrieve per page (default is 10)
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of blogs
 *       500:
 *         description: Internal server error
 */
router.get(
  "/listAll",
  userValidator("paginationHandler"),
  controller.displayBlog
);

/**
 * @swagger
 * /blog/list/{id}:
 *   get:
 *     summary: Get a blog by ID
 *     description: Retrieve a blog post by its ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the blog post to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the blog
 *       400:
 *         description: Bad request
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/list/:id",
  authenticateTokenDoctor,
  validateIdMiddleware,
  validateData,
  controller.getBlogById
);

/**
 * @swagger
 * /blog/delete/{id}:
 *   delete:
 *     summary: Delete a blog by ID
 *     description: Delete a blog post by its ID
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the blog post to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the blog
 *       400:
 *         description: Bad request
 *       404:
 *         description: Blog not found
 *       500:
 *         description: Internal server error
 */
router
  .delete(
    "/delete/:id",
    authenticateTokenDoctor,
    validateIdMiddleware,
    validateData,
    controller.deleteBlog
  )

  .get("/listDoctor", authenticateTokenDoctor, controller.listBlogByDoctorId)
  .put(
    "/admin/edit/:id",
    adminOrSuperAdminAuthenticateToken,
    validateContentType(allowedContentTypes),
    blogValidator("addBlog"),
    validateIdMiddleware,
    validateData,
    controller.editBlogByAdmin
  )

   
  .delete(
    "/admin/delete/:id",
    adminOrSuperAdminAuthenticateToken,
    controller.deleteBlogByAdmin
  )
  .get('/admin/blogs/all',adminOrSuperAdminAuthenticateToken, controller.getBlogsByAdmin)
  .get('/admin/blogs/get/:id',adminOrSuperAdminAuthenticateToken, controller.getBlogDetails);


module.exports = router;
