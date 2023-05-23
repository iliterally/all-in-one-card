const {
  S3Client,
  PutObjectCommand,
  ListObjectsCommand,
  GetObjectCommand
} = require('@aws-sdk/client-s3');

require('dotenv').config();

// Configure the AWS SDK with your access keys and region
const s3Client = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});

const s3UploadGet = {
  listObjects: () => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
    };
    return s3Client.send(new ListObjectsCommand(params));
  },

  uploadFile: async (files, userId) => {
    const uploadPromises = files.map((file) => {
      const key = `uploads/userID:${userId}/${file.originalname}`; // Construct the full key here
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
      };
      return s3Client.send(new PutObjectCommand(params));
    });

    return Promise.all(uploadPromises);
  },

  getObject: async (params) => {
    return s3Client.send(new GetObjectCommand(params));
  }
};



module.exports = {
   s3UploadGet
};

