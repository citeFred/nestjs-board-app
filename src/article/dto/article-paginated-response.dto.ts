import { ArticleWithAttachmentAndUserResponseDto } from "./article-with-attachment-user-response.dto";

export class ArticlePaginatedResponseDto {
    articles: ArticleWithAttachmentAndUserResponseDto[];
    totalCount: number;

    constructor(articles: ArticleWithAttachmentAndUserResponseDto[], totalCount: number) {
        this.articles = articles;
        this.totalCount = totalCount;
    }
}