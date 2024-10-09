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
    origin: [
      'http://localhost:8100','http://localhost:4200', // 로컬 개발용
      'https://d2r1i81lny2w8r.cloudfront.net', // CloudFront 도메인
      'https://boardapp.site', // 커스텀 도메인
      'https://www.boardapp.site', // www 커스텀 도메인
      'http://s3-bucket-boardapp.s3-website.ap-northeast-2.amazonaws.com'
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['Authorization'], // 이 부분 추가
  });


  app.useStaticAssets(path.join(process.cwd(), 'public'), {
    prefix: '/files/'
  });
  
  await app.listen(process.env.SERVER_PORT);
  Logger.log(`Application Running on Port : ${process.env.SERVER_PORT}`)
}
bootstrap();
