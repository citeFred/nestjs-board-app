import { Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
    // 필드 멤버 선언
    private boardsService: BoardsService;
    
    // 생성자 주입(DI)
    constructor(boardsService: BoardsService){}
    
    @Get('/') // GetMapping 핸들러 데코레이터
    getAllBoard(){
        return this.boardsService.getAllBoards();
    }
}
