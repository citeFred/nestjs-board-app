import { IsNotEmpty } from "class-validator";

export class CreateArticleRequestDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    contents: string;
}