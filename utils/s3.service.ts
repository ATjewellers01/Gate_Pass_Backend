import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
import sharp from 'sharp';
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

    const originalBuffer = Buffer.from(base64String, 'base64');
    
    // Compress image using sharp to reduce storage
    const compressedBuffer = await sharp(originalBuffer)
      .resize({ width: 1024, withoutEnlargement: true }) // Limit max width
      .jpeg({ quality: 70 }) // Compress to 70% quality JPEG
      .toBuffer();
      
    // Update extension and contentType since we compressed to jpeg
    extension = 'jpeg';
    contentType = 'image/jpeg';

    const fileName = `visits/${uuidv4()}.${extension}`;
    const bucketName = process.env.bucket_name as string;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      Body: compressedBuffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return `https://${bucketName}.s3.${process.env.region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading image to S3:', error);
    throw error;
  }
};
