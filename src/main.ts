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
  
  await app.listen(process.env.SERVER_PORT);
  Logger.log(`Application Running on Port : ${process.env.SERVER_PORT}`)
}
bootstrap();
