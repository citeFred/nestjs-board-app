import { ArticleStatus } from "../entities/article-status.enum";
import { Article } from "../entities/article.entity";
import { UserResponseDto } from "src/user/dto/user-response.dto";

export class ArticleResponseDto {
    id: number;
    author: string;
    title: string;
    contents: string;
    status: ArticleStatus;
    createdAt: Date;
    updatedAt: Date;
    user: UserResponseDto;

    constructor(article: Article) {
        this.id = article.id;
        this.author = article.author;
        this.title = article.title;
        this.contents = article.contents;
        this.status = article.status;
        this.createdAt = article.createdAt;
        this.updatedAt = article.updatedAt;
        this.user = article.user ? new UserResponseDto(article.user) : null;
    }
}