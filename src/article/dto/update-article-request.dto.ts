import { ArticleStatus } from "../article-status.enum";

export class UpdateArticleRequestDto {
    author: string;
    title: string;
    contents: string;
    status: ArticleStatus;
}