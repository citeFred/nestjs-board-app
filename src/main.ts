import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // cookie parser 미들웨어 추가
  app.use(cookieParser());
  
  app.enableCors({
    origin: ['http://localhost:8100', 'http://localhost:4200'],
    credentials: true,  // 필요한 경우 쿠키를 포함한 요청 허용
  });
  
  await app.listen(process.env.SERVER_PORT);
  Logger.log(`Application Running on Port : ${process.env.SERVER_PORT}`)
}
bootstrap();
