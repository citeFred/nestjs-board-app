import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsService {
    private boards = []; // 임시 DB처럼 사용할 배열(로컬 메모리)

    // 전체 게시글 조회
    getAllBoards() {
        return this.boards;
    }
}