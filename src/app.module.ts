import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { GlobalModule } from './global.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfilePictureModule } from './file/profilePicture/profile-picture.module';

@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticleModule,
    AuthModule,
    UserModule,
    ProfilePictureModule
  ],
})
export class AppModule {}