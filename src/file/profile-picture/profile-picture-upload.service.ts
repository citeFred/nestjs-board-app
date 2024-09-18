import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { ProfilePicture } from './entities/profile-picture.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProfilePictureUploadService {
  private uploadPath = path.join(process.cwd(), 'public', 'uploads', 'profile'); 

  constructor(
    @InjectRepository(ProfilePicture)
    private readonly profilePictureRepository: Repository<ProfilePicture>
  ) { 
    this.ensureUploadPathExists();
  }

  async ensureUploadPathExists() {
    try {
      await fs.mkdir(this.uploadPath, { recursive: true });
    } catch (err) {
      throw new HttpException('Failed to create upload directory', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 프로필 사진 파일 업로드
  async uploadProfilePicture(file: Express.Multer.File) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, uniqueFilename);
    const fileUrl = `http://localhost:${process.env.SERVER_PORT}/files/uploads/profile/${uniqueFilename}`;

    try {
      await fs.writeFile(filePath, file.buffer); // 파일 저장
      return {
        message: 'File uploaded successfully',
        filePath: filePath,
        filename: uniqueFilename,
        mimetype: file.mimetype,
        size: file.size,
        url: fileUrl,
      };
    } catch (err) {
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 프로필 사진 파일 엔터티 데이터베이스에 저장
  async save(file: ProfilePicture) {
    try {
      return await this.profilePictureRepository.save(file);
    } catch (err) {
      throw new HttpException('Failed to save file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
