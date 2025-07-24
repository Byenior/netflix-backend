/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('s3')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Get('test')
  async testS3() {
    try {
      const isConnected = await this.s3Service.testConnection();
      return {
        success: isConnected,
        message: isConnected ? 'S3 connection OK' : 'S3 connection failed',
      };
    } catch (e: any) {
      return { success: false, message: `S3 connection failed: ${e}` };
    }
  }

  @Post('upload-image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder: string,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // ตรวจสอบ file extension
    const rawExt = file.originalname.split('.').pop();
    if (!rawExt) {
      throw new BadRequestException('File has no extension');
    }

    const ext = rawExt.toLowerCase();
    const allowed = ['png', 'jpg', 'jpeg', 'webp'];
    if (!allowed.includes(ext)) {
      throw new BadRequestException(
        'Invalid file type. Allowed: png, jpg, jpeg, webp',
      );
    }

    // ตรวจสอบ mimetype
    if (!file.mimetype || !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('File must be an image');
    }

    try {
      const key = `${folder}/${Date.now()}-${file.originalname}`;
      const url = await this.s3Service.uploadFile(
        file.buffer,
        key,
        file.mimetype,
      );
      return { url, key };

      // const result = await this.s3Service.uploadFile(
      //   file.buffer,
      //   folder + '/' + file.originalname,
      //   file.mimetype,
      // );

      // console.log('File uploaded successfully:', {
      //   filename: file.originalname,
      //   size: file.size,
      //   mimetype: file.mimetype,
      //   url: result,
      // });

      // return {
      //   success: true,
      //   message: 'File uploaded successfully',
      //   url: result,
      //   // key: result.key,
      // };
    } catch (error) {
      console.error('Upload error:', error);
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }

  // // เพิ่ม method นี้เพื่อทดสอบ
  // @Post('upload-local')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadLocal(@UploadedFile() file: Express.Multer.File) {
  //   console.log('Local upload test:', {
  //     hasFile: !!file,
  //     filename: file?.originalname,
  //     size: file?.size,
  //     mimetype: file?.mimetype,
  //     bufferLength: file?.buffer?.length,
  //   });

  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   return {
  //     success: true,
  //     message: 'File received successfully',
  //     filename: file.originalname,
  //     size: file.size,
  //     mimetype: file.mimetype,
  //   };
  // }
}
