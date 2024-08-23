import { Controller, Get } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
    // 생성자 주입(DI)
    constructor(private boardsService: BoardsService){}
    
    @Get('/') // GetMapping 핸들러 데코레이터
    getAllBoard(){
        return this.boardsService.getAllBoards();
    }
}
