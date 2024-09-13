import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { File } from './entities/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileService {
  private uploadPath = '/Users/inyongkim/Documents/Projects/localStorage/profile';
  private defaultPath = '/Users/inyongkim/Documents/Projects/localStorage/default'
  private defaultProfilePicturePath = path.join(this.defaultPath, 'default-profile.png'); // 기본 프로필 사진 경로
  
  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>
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

  // 파일 업로드
  async uploadFile(file: Express.Multer.File) {
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(this.uploadPath, uniqueFilename);
  
    try {
      await fs.writeFile(filePath, file.buffer); // 파일 저장
      return {
        message: 'File uploaded successfully',
        filePath: filePath,
        filename: uniqueFilename,
        mimetype: file.mimetype,
        size: file.size,
      };
    } catch (err) {
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  // 파일 엔터티 데이터베이스에 저장
  async save(file: File) {
    try {
      return await this.fileRepository.save(file);
    } catch (err) {
      throw new HttpException('Failed to save file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  findAll() {
    return `This action returns all files`;
  }

  findOne(id: number) {
    return `This action returns a #${id} file`;
  }

  update(id: number, updateFileDto: any) {
    return `This action updates a #${id} file`;
  }

  remove(id: number) {
    return `This action removes a #${id} file`;
  }
}
