require('dotenv').config();
const multerS3 = require("multer-s3");
const { S3Client ,DeleteObjectCommand} = require("@aws-sdk/client-s3");
const multer = require("multer");
let s3 = new S3Client({
  region: "us-west-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
  },
  endpoint: process.env.S3_ENDPOINT,
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
  limits: { fileSize: 1000000 , files : 1},
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("LIMIT_FILE_TYPE"), false);
    }
  },
});


function handleMulterError(err, req, res, next) {
  if(err.code === "ECONNREFUSED"){
    return res.status(400).send({errorCode : 1176 ,message : "S3 local server connection issue"})
  }
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).send({ errorCode: 1173, message: "Invalid size of file! Maximum size of file is 1MB" });

      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).send({ errorCode: 1177, message: "Unexpected field. Only 'file' field is allowed" });

      case 'LIMIT_FILE_COUNT':
        return res.status(400).send({ errorCode: 1178, message: "Invalid number of files! Only one file is allowed" });

      default:
        return res.status(400).send({ errorCode: 1174, message: "Invalid type of file! Only .png, .jpg and .jpeg format allowed" });
    }
  }
  next(err);
  }


  // Function to delete uploaded file from AWS S3
async function deleteUploadedFile(fileKey) {
  const s3 = new S3Client({
    // Your S3 configuration
    region: "us-west-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
    endpoint: process.env.S3_ENDPOINT,
    sslEnabled: false,
    s3ForcePathStyle: true,
    signatureVersion: "v4",
    });

  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: fileKey,
  };

  await s3.send(new DeleteObjectCommand(params));
}
module.exports = { upload,handleMulterError,deleteUploadedFile};