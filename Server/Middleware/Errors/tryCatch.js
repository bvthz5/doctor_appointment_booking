const logger = require("../../logger");

exports.tryCatch = (controller) => async (req, res, next) => {
    try {
        await controller(req, res, next);

    } catch (error) {
        console.log(error);
        logger.error(`Error occurred: ${error.message}`);
        // If an error occurs, pass it to the 'next' function, which will invoke the error handler middleware
       return next(error);
    }
};