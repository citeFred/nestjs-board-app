import { BoardStatus } from "../board-status.enum";

export class UpdateBoardRequestDto {
    author: string;
    title: string;
    contents: string;
    status: BoardStatus;
}