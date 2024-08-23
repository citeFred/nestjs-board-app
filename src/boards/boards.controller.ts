import { Body, Controller, Get, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';

@Controller('boards')
export class BoardsController {
    // 생성자 주입(DI)
    constructor(private boardsService: BoardsService){}
    
    // 게시글 작성 기능
    @Post('/') // PostMapping 핸들러 데코레이터
    createBoard(
        @Body('author') author: string,
        @Body('title') title: string,
        @Body('contents') contents: string) {
        return this.boardsService.createBoard(author, title, contents)
    }

    // 게시글 조회 기능
    @Get('/') // GetMapping 핸들러 데코레이터
    getAllBoard(): Board[] { // 반환 타입 Board[] 배열
        return this.boardsService.getAllBoards();
    }
}
