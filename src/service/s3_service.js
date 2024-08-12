const { S3 } = require('aws-sdk');
const AWS = require('aws-sdk');
require('dotenv').config();
const uuid = require('uuid').v4;

console.log('in s3_service')

const SESConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    accessSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION_NAME
};

// console.log(process.env.AWS_SECRET_ACCESS_KEY)

AWS.config.update(SESConfig);

exports.s3Uploadv2 = async (file) => {
    const s3 = new S3();

    const params = file.map((file) => {
        return {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${uuid()}-${file.originalname}`,
            ContentType: "image/jpeg",
            Body: file.buffer
        }
    });

    return await Promise.all(params.map(data => s3.upload(data).promise()));
}