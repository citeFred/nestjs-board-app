import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatus } from './board-status.enum';
import { UpdateBoardDto } from './dto/update-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user-role.enum';

@Controller('api/boards')
@UseGuards(AuthGuard('jwt'), RolesGuard) // JWT 인증과 role 커스텀 가드를 적용
export class BoardsController {
    // 생성자 주입(DI)
    constructor(private boardsService: BoardsService){}
    
    // 게시글 작성 기능
    @Post('/') // PostMapping 핸들러 데코레이터
    @Roles(UserRole.USER) // User만 게시글 작성 가능
    createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
        return this.boardsService.createBoard(createBoardDto)
    }

    // 게시글 조회 기능
    @Get('/') // GetMapping 핸들러 데코레이터
    getAllBoard(): Promise<Board[]> {
        return this.boardsService.getAllBoards();
    }

    // 특정 번호의 게시글 조회
    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        return this.boardsService.getBoardById(id);
    }

    // 특정 작성자의 게시글 조회
    @Get('/search/:keyword')
    getBoardByAuthor(@Query('author') author: string): Promise<Board[]> {
        return this.boardsService.getBoardByAuthor(author);
    }

    // 특정 번호의 게시글 삭제
    @Delete('/:id')
    @Roles(UserRole.ADMIN) // ADMIN만 게시글 삭제 가능
    deleteBoardById(@Param('id') id: number): void {
        this.boardsService.deleteBoardById(id);
    }

    // 특정 번호의 게시글의 일부 수정 // 커스텀 파이프 사용은 명시적으로 사용하는 것이 일반적
    @Patch('/:id/status')
    updateBoardStatusById(@Param('id') id: number, @Body('status', BoardStatusValidationPipe) status: BoardStatus): void {
        this.boardsService.updateBoardStatusById(id, status)
    } 

    // 특정 번호의 게시글의 전체 수정
    @Put('/:id')
    updateBoardById(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto): void {
        this.boardsService.updateBoardById(id, updateBoardDto)
    } 
}