import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attachment } from './entities/attachment.entity';
import { AttachmentUploadService } from './attachment-upload.service';
import { AttachmentService } from './attachment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Attachment]),
  ],
  providers: [AttachmentUploadService, AttachmentService],
  exports: [AttachmentUploadService, AttachmentService]
})
export class AttachmentModule {}
