import { BoardStatus } from "../board-status.enum";

export class UpdateBoardDto {
    author: string;
    title: string;
    contents: string;
    status: BoardStatus;
}