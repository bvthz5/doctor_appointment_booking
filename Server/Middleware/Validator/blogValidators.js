const { body, param } = require("express-validator");
const blogValidator = (validationType) => {
  if (validationType === "addBlog") {
    return [
      body("title")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1180, message: "Title is required" })
        .isLength({ max: 50 })
        .withMessage({
          errorCode: 1181,
          message: "Title cannot be greater than 50",
        }),
      body("content")
        .trim()
        .notEmpty()
        .withMessage({ errorCode: 1080, message: "content is required" })
        .isLength({ max: 1000 })
        .withMessage({
          errorCode: 1082,
          message: "content cannot be greater than 1000 characters",
        }),
    ];
  } else {
    return ["error exists"];
  }
};

module.exports = { blogValidator };
