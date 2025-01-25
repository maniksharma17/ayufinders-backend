import { Request, Response } from "express";
import dotenv from "dotenv"
dotenv.config()
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({ region: process.env.AWS_REGION });

export const generatePresignedUrl = async (req: Request, res: Response) => {
  const { fileName, fileType } = req.body;

  if (!fileName || !fileType) {
    res.status(400).json({ error: "File name and type are required." });
    return;
  }

  const key = `${Date.now()}_${fileName}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  };

  try {
    // Generate pre-signed URL
    const command = new PutObjectCommand(params);
    const url = await getSignedUrl(s3Client, command, { expiresIn: 120 }); 

    res.json({ url, key });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Failed to generate pre-signed URL. Please try again." });
  }

}

export const deleteResource = async (req: Request, res: Response) => {
  const { key } = req.params;

  if (!key) {
    res.status(400).json({ error: "S3 Key is required." });
    return;
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  };

  try {
    // Generate pre-signed URL
    const command = new DeleteObjectCommand(params);
    await s3Client.send(command)

    res.json({ message: "Resource deleted successfully.", key });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    res.status(500).json({ error: "Failed to generate pre-signed URL. Please try again." });
  }

}
