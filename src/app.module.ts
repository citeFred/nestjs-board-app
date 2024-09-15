import { Module } from '@nestjs/common';
import { ArticleModule } from './article/article.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './configs/typeorm.config';
import { GlobalModule } from './global.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProfilePictureModule } from './file/profilePicture/profile-picture.module';
import { AttachmentModule } from './file/attachment/attachment.module';

@Module({
  imports: [
    GlobalModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    ArticleModule,
    AuthModule,
    UserModule,
    ProfilePictureModule,
    AttachmentModule,
  ],
})
export class AppModule {}