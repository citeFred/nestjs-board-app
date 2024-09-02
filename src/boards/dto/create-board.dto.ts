import { IsNotEmpty } from "class-validator";

export class CreateBoardDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    contents: string;
}