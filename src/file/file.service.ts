import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  private uploadPath = '/Users/inyongkim/Documents/Projects/localStorage';

  constructor() {
    // 저장 경로가 존재하지 않으면 폴더를 생성
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
    const filePath = path.join(this.uploadPath, file.originalname);

    try {
      await fs.writeFile(filePath, file.buffer); // 파일 저장
      return { message: 'File uploaded successfully', filePath };
    } catch (err) {
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
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
