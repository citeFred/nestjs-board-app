import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attachment } from './entities/attachment.entity';
import { S3Service } from '../aws-s3/s3.service';

@Injectable()
export class AttachmentUploadService {
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>,
    private readonly s3Service: S3Service,
  ) {}

  // 파일 업로드
  async uploadFile(file: Express.Multer.File) {
    try {
      const fileMetadata = await this.s3Service.uploadFile(file, 'public');
      return {
        message: 'File uploaded successfully',
        ...fileMetadata,
      };
    } catch (err) {
      console.error('S3 Upload Error:', err);
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 파일 엔터티 데이터베이스에 저장
  async save(file: Attachment) {
    try {
      return await this.attachmentRepository.save(file);
    } catch (err) {
      throw new HttpException('Failed to save file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
