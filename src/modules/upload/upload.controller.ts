import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('images')
export class UploadController {
  @Get('movies/:filename')
  getMovieImage(@Param('filename') filename: string, @Res() res: Response) {
    // แก้ไข path ให้ถูกต้อง
    const imagePath = join(
      __dirname,
      '..', // จาก modules
      '..', // จาก src
      '..', // จาก netflix-backend root
      'public',
      'movies',
      filename,
    );

    console.log('Looking for image at:', imagePath); // เพื่อ debug

    if (!existsSync(imagePath)) {
      console.log('Image not found at:', imagePath);
      throw new NotFoundException(`Image not found: ${filename}`);
    }

    // เพิ่ม content-type headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000');

    res.sendFile(imagePath);
  }
}
