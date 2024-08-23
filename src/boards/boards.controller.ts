import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';

@Controller('boards')
export class BoardsController {
    // 생성자 주입(DI)
    constructor(private boardsService: BoardsService){}
    
    // 게시글 작성 기능
    @Post('/') // PostMapping 핸들러 데코레이터
    createBoard(@Body() createBoardDto: CreateBoardDto)  {
        return this.boardsService.createBoard(createBoardDto)
    }

    // 게시글 조회 기능
    @Get('/') // GetMapping 핸들러 데코레이터
    getAllBoard(): Board[] { // 반환 타입 Board[] 배열
        return this.boardsService.getAllBoards();
    }

    // 특정 번호의 게시글 조회
    @Get('/:id')
    getBoardById(@Param('id') id: number): Board{
        return this.boardsService.getBoardById(id);
    }

    // 특정 작성자의 게시글 조회
    @Get('/search/:keyword')
    getBoardByAuthor(@Query('author') author: string): Board[]{
        return this.boardsService.getBoardByAuthor(author);
    }
}