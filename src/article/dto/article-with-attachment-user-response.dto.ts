import { AttachmentResponseDto } from "src/file/attachment/dto/attachment-response.dto";
import { ArticleStatus } from "../entities/article-status.enum";
import { Article } from "../entities/article.entity";
import { UserResponseDto } from "src/user/dto/user-response.dto";

export class ArticleWithAttachmentAndUserResponseDto {
    id: number;
    title: string;
    contents: string;
    status: ArticleStatus;
    createdAt: Date;
    updatedAt: Date;
    author: UserResponseDto;
    attachments: AttachmentResponseDto[];

    constructor(article: Article) {
        this.id = article.id;
        this.author = article.author;
        this.title = article.title;
        this.contents = article.contents;
        this.status = article.status;
        this.createdAt = article.createdAt;
        this.updatedAt = article.updatedAt;
        this.author = article.author ? new UserResponseDto(article.author) : null;
        this.attachments = article.attachments?article.attachments.map(attachment => new AttachmentResponseDto(attachment)) 
        : [];
    }
}