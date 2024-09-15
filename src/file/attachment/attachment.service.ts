import { Injectable } from '@nestjs/common';
import { Attachment } from './entities/attachment.entity';
import { AttachmentType } from './entities/attachment-type.enum';
import { AttachmentUploadService } from './attachment-upload.service';
import { Article } from 'src/article/entities/article.entity';

@Injectable()
export class AttachmentService {
    constructor(private readonly attachmentUploadService: AttachmentUploadService) {}

    // 게시글 파일 업로드
    async uploadArticleFiles(file: Express.Multer.File, article: Article) {
        // 파일 업로드
        const result = await this.attachmentUploadService.uploadFile(file);

        // 파일 메타데이터 저장
        const newFile = await this.createFileMetadata(result, article);

        // 파일 엔터티를 데이터베이스에 저장
        await this.attachmentUploadService.save(newFile);

        return result;
    }

    // 파일 메타데이터 생성 메서드
    private async createFileMetadata(result: any, article: Article): Promise<Attachment> {
        const newFile = new Attachment();
        newFile.path = result.filePath;
        newFile.filename = result.filename;
        newFile.mimetype = result.mimetype;
        newFile.size = result.size;
        newFile.attachmentType = AttachmentType.IMAGE;
        newFile.url = result.url;
        newFile.article = article;
        return newFile;
    }
}
