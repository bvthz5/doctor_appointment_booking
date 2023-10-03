const { where } = require("sequelize");
const Blog = require("../Model/blogModel");
const Doctor = require("../Model/doctorModel");
const { createCustomError } = require("../Middleware/Errors/errorHandler");
const logger = require("../logger");
const { COMMON_STATUS } = require("../Util/constants");

/**
 * Creates a new blog post in the database.
 *
 * @function
 * @async
 * @param {Object} data - The data for the blog post to be created.
 * @param {Object} user - The user object containing information about the creator.
 * @returns {Promise<void>} - A Promise that resolves when the blog post is successfully created.
 */
const createBlogService = async (data, user) => {
  data.status = COMMON_STATUS.ACTIVE;
  data.doctorId = user.id;

  const create = await Blog.create(data);
};

/**
 * Edits an existing blog post using the provided data and blog ID.
 *
 * @function
 * @async
 * @param {Object} data - The updated data for the blog post.
 * @param {Object|null} blog - The existing blog post object to be updated.
 * @param {number} blogId - The ID of the blog post to be updated.
 * @returns {Promise<void>} - A Promise that resolves when the blog post is successfully updated.
 */
const editBlogService = async (data, blog, blogId) => {
  if (!blog) {
    const error = createCustomError("Blog not found", 404);
    throw error;
  }

  await Blog.update(data, {
    where: { id: blogId, status: COMMON_STATUS.ACTIVE },
  });
};

/**
 * Retrieves a paginated list of all active blog posts with associated doctor information.
 *
 * @function
 * @async
 * @param {number} page - The current page number for pagination.
 * @param {number} limit - The maximum number of blog posts to retrieve per page.
 * @returns {Promise<{ count: number, blogs: Object[] }>} - A Promise that resolves to an object containing the total count and a list of retrieved blog posts.
 */
const listAllBlog = async (page, limit) => {
  const { count, rows } = await Blog.findAndCountAll({
    // Set the maximum number of blogs to retrieve per page
    limit: limit,

    // Calculate the offset to determine which blogs to retrieve for the current page
    offset: (page - 1) * limit,

    order: [["updatedAt", "DESC"]],

    where: { status: COMMON_STATUS.ACTIVE },
    // Include additional information from the associated Doctor model
    include: [
      {
        model: Doctor,
        attributes: ["name", "imageKey", "designation", "qualification"],
      },
    ],
  });

  return { count, blogs: rows };
};

/**
 * Retrieves a blog post by its ID associated with a specific user.
 *
 * @function
 * @async
 * @param {number} blogId - The ID of the blog post to retrieve.
 * @param {number} userId - The ID of the user associated with the blog post.
 * @returns {Promise<Object|null>} - A Promise that resolves to the retrieved blog post object or null if not found.
 */
const listBlogById = async (blogId, userId) => {
  const listById = await Blog.findOne({
    where: { id: blogId, doctorId: userId, status: COMMON_STATUS.ACTIVE },
  });
  if (!blog) {
    logger.warn("Blog not found");
    return null;
  }
  return blog;
};

/**
 * Deletes a specific blog post by its ID if it exists, associated with the requesting user.
 *
 * @function
 * @async
 * @param {number} blogId - The ID of the blog post to be deleted.
 * @param {number} userId - The ID of the user associated with the blog post.
 * @returns {Promise<{ deleted: boolean }>} - A Promise that resolves to an object indicating whether the deletion was successful.
 */
const deleteBlogById = async (blogId, userId) => {
  const blog = await listBlogById(blogId, userId);

  if (!blog) {
    return { deleted: false };
  }

  // Update the blog's status to "0" (Inactive) in the database
  await Blog.update(
    { status: COMMON_STATUS.INACTIVE },
    { where: { id: blogId } }
  );

  return { deleted: true };
};

/**
 * Retrieves a paginated list of blog posts associated with a specific doctor.
 *
 * @function
 * @async
 * @param {number} doctorId - The ID of the doctor whose blog posts are to be retrieved.
 * @param {number} page - The current page number for pagination.
 * @param {number} limit - The maximum number of blog posts to retrieve per page.
 * @returns {Promise<{ blogs: Object[], totalCount: number }>} - A Promise that resolves to an object containing the paginated blog list and the total count of blog posts associated with the doctor.
 */
const blogListByDoctorById = async (doctorId, page, limit) => {
  const offset = (page - 1) * limit;

  const blogs = await Blog.findAll({
    where: {
      doctorId: doctorId,
      status: COMMON_STATUS.ACTIVE,
    },
    offset,
    limit,
  });

  const totalCount = await Blog.count({
    where: {
      doctorId: doctorId,
      status: COMMON_STATUS.ACTIVE,
    },
  });

  return { blogs, totalCount };
};

const getBlogById = async (id) => {
  const blog = await Blog.findOne({
    where: {
      id: id,
      status: COMMON_STATUS.ACTIVE,
    },
  });
  return blog
};

module.exports = {
  getBlogById,
  createBlogService,
  editBlogService,
  listAllBlog,
  listBlogById,
  deleteBlogById,
  blogListByDoctorById,
};
