import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private region: string;

  constructor() {
    this.region = process.env.AWS_REGION || 'ap-southeast-1';
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'netflix-images';

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  // Method ที่ Controller เรียกใช้
  async uploadFile(
    buffer: Buffer,
    key: string,
    mimetype: string,
  ): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
      });

      console.log('Uploading to S3:', {
        bucket: this.bucketName,
        key: key,
        size: buffer.length,
      });

      await this.s3Client.send(command);

      // Return URL
      const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${key}`;

      console.log('Upload successful:', url);
      return url;
    } catch (error) {
      console.error('S3 Upload Error:', error);
      throw new Error(`Failed to upload to S3: ${error}`);
    }
  }

  // เพิ่ม method uploadMulterFile
  //   async uploadMulterFile(
  //     file: Express.Multer.File,
  //   ): Promise<{ url: string; key: string }> {
  //     try {
  //       if (!file?.buffer || !file?.originalname) {
  //         throw new Error('Invalid file: missing buffer or originalname');
  //       }

  //       const fileExtension = file.originalname.split('.').pop() || 'png';
  //       const fileName = `movies/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExtension}`;

  //       const command = new PutObjectCommand({
  //         Bucket: this.bucketName,
  //         Key: fileName,
  //         Body: file.buffer,
  //         ContentType: file.mimetype || 'image/png',
  //       });

  //       await this.s3Client.send(command);

  //       const url = `https://${this.bucketName}.s3.${this.region}.amazonaws.com/${fileName}`;

  //       return { url, key: fileName };
  //     } catch (error: unknown) {
  //       const errorMessage =
  //         error instanceof Error ? error.message : String(error);
  //       throw new Error(`Failed to upload to S3: ${errorMessage}`);
  //     }
  //   }

  async testConnection(): Promise<boolean> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1,
      });

      await this.s3Client.send(command);
      console.log('S3 Connection successful!');
      return true;
    } catch (error) {
      console.error('S3 Connection Test Failed:', error);
      return false;
    }
  }
}
