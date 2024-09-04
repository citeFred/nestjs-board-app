import { IsNotEmpty } from "class-validator";

export class CreateBoardRequestDto {
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    contents: string;
}