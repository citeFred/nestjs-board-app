import { Module } from '@nestjs/common';
import { ProfilePictureUploadService } from './profile-picture-upload.service';
import { ProfilePicture } from './entities/profile-picture.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilePictureService } from './profile-picture.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProfilePicture]),
  ],
  providers: [ProfilePictureUploadService, ProfilePictureService],
  exports: [ProfilePictureUploadService, ProfilePictureService]
})
export class ProfilePictureModule {}
