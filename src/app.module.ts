// filepath: /Users/macbook/Desktop/Code/NextZy/Netflix/netflix-backend/src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { MovieModule } from './modules/movie/movie.module';
import { LoginModule } from './modules/login/login.module';

@Module({
  imports: [PrismaModule, MovieModule, LoginModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
