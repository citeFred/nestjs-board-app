import { Injectable } from '@nestjs/common';
import { Board } from './board.entity';
import { BoardStatus } from './board-status.enum';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
    private boards: Board[] = []; // 임시 DB처럼 사용할 배열(로컬 메모리) // 저장되는 데이터 타입 Board[] 배열

    // 게시글 작성
    createBoard(createBoardDto: CreateBoardDto) {
        const {author, title, contents} = createBoardDto;

        const board: Board = {
            id: this.boards.length + 1, // 임시 Auto Increament 
            author,
            title,
            contents,
            status: BoardStatus.PUBLIC
        }

        this.boards.push(board);
        return board;
    }

    // 전체 게시글 조회
    getAllBoards(): Board[] { // 반환 타입 Board[] 배열
        return this.boards;
    }

    // 특정 번호의 게시글 조회
    getBoardById(id: number): Board {
        return this.boards.find((board) => board.id == id);
    }

    // 특정 작성자의 게시글 조회
    getBoardByAuthor(author: string): Board[]{
        return this.boards.filter((board) => board.author === author)
    }

    // 특정 번호의 게시글 삭제
    deleteBoardById(id: number): void{
        this.boards = this.boards.filter((board) => board.id != id);
    }

    // 특정 번호의 게시글의 일부 수정
    updateBoardStatusById(id: number, status: BoardStatus): Board {
        const board = this.getBoardById(id);
        board.status = status;
        return board;
    }

    // 특정 번호의 게시글의 전체 수정
    updateBoardById(id, updateBoardDto : UpdateBoardDto): Board {
        const board = this.getBoardById(id);
        const {author, title, contents, status} = updateBoardDto;

        board.author = author;
        board.title = title;
        board.contents = contents;
        board.status = status;
        return board;
    }
}