import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { S3Service } from './s3.service';

@Module({
  controllers: [UploadController],
  providers: [S3Service],
  exports: [S3Service], // Export เพื่อใช้ใน module อื่น
})
export class UploadModule {}
