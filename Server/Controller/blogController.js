const { validationResult } = require("express-validator");
const {
  createBlogService,
  editBlogService,
  listAllBlog,
  listBlogById,
  deleteBlogById,
  blogListByDoctorById,
} = require("../Service/blogService");
const blogService = require("../Service/blogService");
const hospitalService = require("../Service/hospitalService");
const doctorService = require("../Service/doctorService");

const { tryCatch } = require("../Middleware/Errors/tryCatch");
const logger = require("../logger");
const { COMMON_STATUS } = require("../Util/constants");
const { getBlogList } = require("../Service/bookingService");

/**
 * Creates a new blog post.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the blog post data.
 * @param {Object} res - The response object to send the HTTP response.
 * @returns {void}
 */
const createBlog = tryCatch(async (req, res) => {
  await createBlogService(req.body, req.user);
  res.status(201).json({ message: "Blog created successfully" });
  logger.info("Blog created successfully");
});

/**
 * Updates an existing blog post.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the updated blog post data and parameters.
 * @param {Object} res - The response object to send the HTTP response.
 * @returns {void}
 */
const updateBlog = tryCatch(async (req, res) => {
  const blogId = req.params.id;
  const data = req.body;
  const blog = await listBlogById(blogId, req.user.id);
  await editBlogService(data, blog, blogId);
  res.status(200).json({ message: "Blog updated successfully" });
  logger.info("Blog updated successfully");
});

/**
 * Displays a paginated list of blog posts.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing pagination parameters.
 * @param {Object} res - The response object to send the paginated blog list.
 * @returns {void}
 */
const displayBlog = tryCatch(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { count, blogs } = await listAllBlog(page, limit);

  const totalPages = Math.ceil(count / limit);
  const hasNextPage = page < totalPages;

  const response = {
    items: blogs,
    pagination: {
      currentPage: page,
      totalPages,
      hasNextPage,
      totalItems: count,
    },
  };

  res.status(200).json(response);
  logger.info("Blog Listed");
});

/**
 * Retrieves a specific blog post by its ID, associated with the requesting user.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the blog ID parameter and user information.
 * @param {Object} res - The response object to send the retrieved blog post or an error response.
 * @returns {void}
 */
const getBlogById = tryCatch(async (req, res) => {
  const blogId = req.params.id;

  const blog = await listBlogById(blogId, req.user.id);
  if (!blog) {
    logger.warn(`Blog not found for ID: ${blogId}`);
    return res
      .status(404)
      .json({ errorCode: "1190", message: "Blog not found" });
  }
  logger.info(`Blog retrieved successfully for ID: ${blogId}`);
  return res.status(200).json(blog);
});

/**
 * Deletes a specific blog post by its ID, associated with the requesting user.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the blog ID parameter and user information.
 * @param {Object} res - The response object to send a success or error response.
 * @returns {void}
 */
const deleteBlog = tryCatch(async (req, res) => {
  const blogId = req.params.id;

  const result = await deleteBlogById(blogId, req.user.id);

  if (result.deleted) {
    logger.info(`Blog deleted successfully for ID: ${blogId}`);
    res.status(200).json({ message: "Blog Deleted Successfully" });
  } else {
    logger.warn(`Blog not found for ID: ${blogId}`);
    res.status(404).json({ errorCode: "1190", message: "Blog Not Found" });
  }
});

/**
 * Retrieves a paginated list of blog posts associated with a specific doctor.
 *
 * @function
 * @async
 * @param {Object} req - The request object containing the doctor's user information and pagination parameters.
 * @param {Object} res - The response object to send the paginated blog list.
 * @returns {void}
 */
const listBlogByDoctorId = tryCatch(async (req, res) => {
  const doctorId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const { blogs, totalCount } = await blogListByDoctorById(
    doctorId,
    page,
    limit
  );

  const hasNext = page * limit < totalCount;
  const hasPrevious = page > 1;

  res.status(200).json({
    blogs,
    count: blogs.length,
    currentPage: page,
    hasNext,
    hasPrevious,
  });
});

/**
 * Edit a blog by an administrator or superadministrator.
 *
 * @async
 * @function editBlogByAdmin
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @throws {Error} If an error occurs while processing the request.
 * @returns {void}
 */

const editBlogByAdmin = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await blogService.getBlogById(blogId);
    if (!blog) {
      return res
        .status(404)
        .send({ errorCode: "1190", message: "Blog not found" });
    } else if (req.user.role === "ADMIN" || req.user.role === "SUPERADMIN") {
      if (req.user?.role === "ADMIN") {
        const hospital = await hospitalService.getHospitalByAdminId(
          req.user.id
        );
        const doctor = await doctorService.getById(blog?.dataValues?.doctorId);
        if (hospital?.dataValues.id !== doctor?.dataValues?.hospitalId) {
          return res.status(403).send({ message: "Access denied" });
        }
      }
      let data = req.body;
      await editBlogService(data, blog, blogId);
      res.send({ message: "Blog updated successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Delete a blog by an administrator or superadministrator.
 *
 * @async
 * @function deleteBlogByAdmin
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @throws {Error} If an error occurs while processing the request.
 * @returns {void}
 */
const deleteBlogByAdmin = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await blogService.getBlogById(blogId);

    // If the blog is not found, return a 404 response and exit the function.
    if (!blog) {
      return res
        .status(404)
        .send({ errorCode: "1190", message: "Blog not found" });
    } else if (req.user.role === "ADMIN" || req.user.role === "SUPERADMIN") {
      if (req.user?.role === "ADMIN") {
        const hospital = await hospitalService.getHospitalByAdminId(
          req.user.id
        );
        const doctor = await doctorService.getById(blog?.dataValues?.doctorId);

        // If access is denied (hospital ID doesn't match doctor's hospital ID), return a 403 response and exit the function.
        if (hospital?.dataValues.id !== doctor?.dataValues?.hospitalId) {
          return res.status(403).send({ message: "Access denied" });
        }
      }

      let data = {
        status: COMMON_STATUS.INACTIVE,
      };

      // Perform the editBlogService operation to set the blog as inactive.

      await editBlogService(data, blog, blogId);
      res.send({ message: "Blog deleted successfully" });
    }
  } catch (error) {
    logger.error(`Error occurred: ${error.message}`);
    next(error);
  }
};

/**
 * Get a list of blogs for administrators based on specified criteria.
 *
 * @async
 * @param {object} req - The HTTP request object.
 * @param {object} res - The HTTP response object.
 * @param {function} next - The next middleware function.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
const getBlogsByAdmin = async (req, res, next) => {
  try {
    const doctorId = req.query.doctorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    let hospitalId;
    let doctorIds = [];
    if (doctorId) {
      doctorIds = doctorId.split(",").map(Number);
    } else {
      if (req.user.role === "SUPERADMIN") {
        hospitalId = req.query.hospitalId;
      } else if (req.user.role === "ADMIN") {
        const hospital = await hospitalService.getHospitalByAdminId(
          req.user.id
        );
        if (hospital) {
          hospitalId = hospital.dataValues.id;
        } else {
          return res.status(400).send(" No hospital allocated for admin");
        }
      }
      let doctors;
      if (hospitalId) {
        doctors = await doctorService.getAllDoctorsbyHospId(hospitalId);
      }
      if (doctors) {
        doctorIds = doctors.map((data) => {
          return data.dataValues.id;
        });
      }
    }
    const { items, count } = await getBlogList(page, limit, search, doctorIds);

    const totalPages = Math.ceil(count / limit);
    const hasNext = page < totalPages;
    const response = {
      items,
      count,
      hasNext,
      currentPage: page,
      totalPages,
    };

    res.status(200).json(response);
    logger.info("Blog listed");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getBlogDetails = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await blogService.getBlogById(blogId);
    if (!blog) {
      return res
        .status(404)
        .json({ errorCode: "1190", message: "Blog not found" });
    } else {
      logger.info(`Blog retrieved successfully for ID: ${blogId}`);
      return res.status(200).json(blog);
    }
  } catch (error) {}
};

module.exports = {
  getBlogDetails,
  getBlogsByAdmin,
  deleteBlogByAdmin,
  editBlogByAdmin,
  createBlog,
  updateBlog,
  displayBlog,
  getBlogById,
  deleteBlog,
  listBlogByDoctorId,
};
