import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const s3Client = new S3Client({
  region: process.env.region as string,
  credentials: {
    accessKeyId: process.env.access_key as string,
    secretAccessKey: process.env.secret_access_key as string,
  },
});

export const uploadBase64ImageToS3 = async (base64Data: string): Promise<string> => {
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

    const buffer = Buffer.from(base64String, 'base64');
    const fileName = `visits/${uuidv4()}.${extension}`;
    const bucketName = process.env.bucket_name as string;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};
