import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import * as https from 'https'; // https 모듈 추가

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

  // HTTPS 옵션 설정
  const httpsOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.boardapp.site/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.boardapp.site/fullchain.pem'),
  };

  // HTTPS 서버 생성
  const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());

  // NestJS 애플리케이션을 HTTPS 서버에 연결 (HTTPS 적용)
  server.listen(process.env.HTTPS_SERVER_PORT, ()=> {
    Logger.log(`Application Running on [SECURED] https://api.boardapp.site:${process.env.HTTPS_SERVER_PORT}`);
  });

  // NestJS 애플리케이션 시작 (HTTPS 기존)
  await app.listen(process.env.HTTP_SERVER_PORT, ()=> {
    Logger.log(`Application Running on [BASIC] http://localhost:${process.env.HTTP_SERVER_PORT}`);
  });
}
bootstrap();