import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfilePicture } from './entities/profile-picture.entity';
import { S3Service } from '../aws-s3/s3.service';

@Injectable()
export class ProfilePictureUploadService {
  constructor(
    @InjectRepository(ProfilePicture)
    private readonly profilePictureRepository: Repository<ProfilePicture>,
    private readonly s3Service: S3Service,
  ) {}

  // 프로필 사진 파일 업로드
  async uploadProfilePicture(file: Express.Multer.File) {
    try {
      const fileMetadata = await this.s3Service.uploadFile(file, 'private');
      return {
        message: 'File uploaded successfully',
        ...fileMetadata
      };
    } catch (err) {
      console.error('S3 Upload Error:', err);
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 프로필 사진 엔터티 데이터베이스에 저장
  async save(file: ProfilePicture) {
    try {
      return await this.profilePictureRepository.save(file);
    } catch (err) {
      throw new HttpException('Failed to save file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
