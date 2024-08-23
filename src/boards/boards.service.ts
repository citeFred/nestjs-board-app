import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';

@Injectable()
export class BoardsService {
    private boards: Board[] = []; // 임시 DB처럼 사용할 배열(로컬 메모리) // 저장되는 데이터 타입 Board[] 배열

    // 전체 게시글 조회
    getAllBoards(): Board[] { // 반환 타입 Board[] 배열
        return this.boards;
    }
}