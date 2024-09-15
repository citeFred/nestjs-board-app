import { Module } from '@nestjs/common';
import { ProfilePictureUploadService } from './profile-picture-upload.service';
import { ProfilePicture } from './entities/profile-picture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePictureService } from './profile-picture.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePicture]),
    UserModule,
  ],
  providers: [ProfilePictureUploadService, ProfilePictureService],
  exports: [ProfilePictureUploadService, ProfilePictureService]
})
export class ProfilePictureModule {}
