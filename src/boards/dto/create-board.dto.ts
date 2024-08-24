import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty() // null 값 체크
    author: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    contents: string;
}