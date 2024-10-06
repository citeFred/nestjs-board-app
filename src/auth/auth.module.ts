import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "src/user/entities/user.entity";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { KakaoStrategy } from './kakao.strategy';
import { UserModule } from 'src/user/user.module';
import { FileModule } from 'src/file/file.module';
import { ProfilePictureService } from 'src/file/profile-picture/profile-picture.service';

dotenv.config();

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions:{
        expiresIn: parseInt(process.env.JWT_EXPIRATION, 10)
      }  
    }),
    TypeOrmModule.forFeature([User]),
    HttpModule,
    FileModule,
    UserModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, KakaoStrategy, ProfilePictureService],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
