const { validationResult } = require('express-validator');
const {deleteUploadedFile} = require("../../Util/fileUpload")


const validateContentType = (allowedContentTypes) => {
    return (req, res, next) => {
      const contentType = req.headers['content-type'];
      if (!contentType?.startsWith(allowedContentTypes[0])) {
        return res.status(400).send({ errorCode: 1901, message: "Request should be in valid content type" });
      }
      next();
    };
  };
  
  const validateData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      const uploadedFileKey = req.file ? req.file.key : null;
      console.log(uploadedFileKey);
    
      // Delete the uploaded file if it exists
      if (uploadedFileKey) {
        try {
          await deleteUploadedFile(uploadedFileKey);
        } catch (deleteError) {
          console.error('Error deleting uploaded file:', deleteError);
        }
      }
      return res.status(400).send(errors.errors[0].msg);
    } else {
      next();
    }
  };

module.exports = {validateContentType, validateData}
