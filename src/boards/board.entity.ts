import { BoardStatus } from "./board-status.enum";

export class Board {
    id: number;
    author: string;
    title: string;
    contents: string;
    status: BoardStatus;
}