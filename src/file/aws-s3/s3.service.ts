import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, bucketName: string): Promise<string> {
    const encodedFileName = encodeURIComponent(`${Date.now()}-${file.originalname}`);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: encodedFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    });
  
    await this.s3.send(command);
    return `https://${bucketName}.s3.amazonaws.com/${encodedFileName}`; // 반환 URL
  }
}
