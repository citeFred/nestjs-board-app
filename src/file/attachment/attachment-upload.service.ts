import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Attachment } from './entities/attachment.entity';

@Injectable()
export class AttachmentUploadService {
  private uploadPath = path.join(process.cwd(), 'public', 'uploads', 'attachment'); 
  
  constructor(
    @InjectRepository(Attachment)
    private readonly attachmentRepository: Repository<Attachment>
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
    const fileUrl = `http://localhost:${process.env.SERVER_PORT}/files/uploads/attachment/${uniqueFilename}`;

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

  // 파일 엔터티 데이터베이스에 저장
  async save(file: Attachment) {
    try {
      return await this.attachmentRepository.save(file);
    } catch (err) {
      throw new HttpException('Failed to save file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
