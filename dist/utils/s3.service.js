"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBase64ImageToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
dotenv_1.default.config();
const s3Client = new client_s3_1.S3Client({
    region: process.env.region,
    credentials: {
        accessKeyId: process.env.access_key,
        secretAccessKey: process.env.secret_access_key,
    },
});
const uploadBase64ImageToS3 = async (base64Data) => {
    try {
        const matches = base64Data.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        let extension = 'jpeg';
        let base64String = base64Data;
        let contentType = 'image/jpeg';
        if (matches && matches.length === 3) {
            extension = matches[1];
            base64String = matches[2];
            contentType = `image/${extension}`;
        }
        const originalBuffer = Buffer.from(base64String, 'base64');
        // Compress image using sharp to reduce storage
        const compressedBuffer = await (0, sharp_1.default)(originalBuffer)
            .resize({ width: 1024, withoutEnlargement: true }) // Limit max width
            .jpeg({ quality: 70 }) // Compress to 70% quality JPEG
            .toBuffer();
        // Update extension and contentType since we compressed to jpeg
        extension = 'jpeg';
        contentType = 'image/jpeg';
        const fileName = `visits/${(0, uuid_1.v4)()}.${extension}`;
        const bucketName = process.env.bucket_name;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: compressedBuffer,
            ContentType: contentType,
        });
        await s3Client.send(command);
        return `https://${bucketName}.s3.${process.env.region}.amazonaws.com/${fileName}`;
    }
    catch (error) {
        console.error('Error uploading image to S3:', error);
        throw error;
    }
};
exports.uploadBase64ImageToS3 = uploadBase64ImageToS3;
