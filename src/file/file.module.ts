// file/file.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentUploadService } from './attachment/attachment-upload.service';
import { Attachment } from './attachment/entities/attachment.entity';
import { ProfilePictureUploadService } from './profile-picture/profile-picture-upload.service';
import { ProfilePicture } from './profile-picture/entities/profile-picture.entity';
import { S3Service } from './aws-s3/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment, ProfilePicture]),
  ],
  providers: [AttachmentUploadService, ProfilePictureUploadService, S3Service],
  exports: [AttachmentUploadService, ProfilePictureUploadService],
})
export class FileModule {}
