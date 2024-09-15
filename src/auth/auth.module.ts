import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from "src/user/user.entity";
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './jwt.strategy';
import { HttpModule } from '@nestjs/axios';
import { KakaoStrategy } from './kakao.strategy';
import { ProfilePictureModule } from 'src/file/profilePicture/profile-picture.module';

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
    ProfilePictureModule
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, KakaoStrategy],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
