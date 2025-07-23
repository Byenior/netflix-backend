import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './modules/movie/movie.module';
import { LoginModule } from './modules/login/login.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [PrismaModule, MovieModule, LoginModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
