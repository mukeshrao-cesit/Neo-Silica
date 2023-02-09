import S3 from 'aws-sdk/clients/s3.js'
import dotenv from 'dotenv'
import asynHandler from 'express-async-handler'
import path from 'path'
dotenv.config()







export const s3UpdataSingle = asynHandler(async (req, res, next) => {
    const s3 = new S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_BUCKET_REGION
    })
    const file = req.file;
    const params = {
        Bucket: "healthcoach-fitness",
        Key: file.originalname,
        Body: file.buffer
    };
    try {
        console.log("start uploading");
        const data = await s3.upload(params).promise();
        console.log("finish uploading");

        req.file = { path: data.Location };
        next();
    } catch (err) {
        console.log(err);
        res.status(400);
        throw new Error('Upload failed');
    }
});
const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION
})




