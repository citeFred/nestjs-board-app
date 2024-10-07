import { Injectable } from '@nestjs/common';
import { S3 } from '@aws-sdk/client-s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3Service {
  private s3: S3;

  constructor() {
    this.s3 = new S3({
      region: process.env.AWS_S3_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, prefix: string): Promise<any> {
    const normalizeFileName = this.normalizeFileName(file.originalname);
    const filePath = `${prefix}/${normalizeFileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filePath,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.s3.send(command);

    // CloudFront URL 반환 및 메타데이터
    return {
      url: `https://${process.env.AWS_CLOUDFRONT_DOMAIN}/${filePath}`,
      filename: normalizeFileName,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  private normalizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')  // 알파벳, 숫자, 점, 하이픈만 허용
      .replace(/_{2,}/g, '_')            // 연속된 언더바를 하나로
      .replace(/^_|_$/g, '');            // 언더바로 시작하거나 끝나는 경우 제거
  }
}
