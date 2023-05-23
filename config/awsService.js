const {
  S3Client,
  PutObjectCommand,
} = require('@aws-sdk/client-s3');

require('dotenv').config();

const s3Upload = async (files, userId) => {
  const s3Client = new S3Client({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  const uploadPromises = files.map((file) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `uploads/userID:${userId}/${file.originalname}`,
      Body: file.buffer,
    };
    return s3Client.send(new PutObjectCommand(params));
  });

  const uploadResults = await Promise.all(uploadPromises);
  const fileUrls = uploadResults.map(result => result.Location);

  return fileUrls;
};

module.exports = {
  s3Upload
};