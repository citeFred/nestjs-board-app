import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // cookie parser 미들웨어 추가
  app.use(cookieParser());
  
  app.enableCors({
    origin: ['http://localhost:8100', 'http://localhost:4200'],
    credentials: true,  // 필요한 경우 쿠키를 포함한 요청 허용
  });

  app.useStaticAssets(path.join(__dirname, '..', 'public', 'uploads'), {
    prefix: '/uploads/', // 클라이언트에서 접근할 URL 경로
  });
  
  await app.listen(process.env.SERVER_PORT);
  Logger.log(`Application Running on Port : ${process.env.SERVER_PORT}`)
}
bootstrap();
