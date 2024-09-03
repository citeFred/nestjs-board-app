import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('api/boards')
@UseGuards(AuthGuard('jwt'), RolesGuard) // JWT 인증과 role 커스텀 가드를 적용
export class BoardsController {
    private readonly logger = new Logger(BoardsController.name); // Logger 인스턴스 생성

    // 생성자 주입(DI)
    constructor(private boardsService: BoardsService){}
    
    // 게시글 작성 기능
    @Post('/') // PostMapping 핸들러 데코레이터
    @Roles(UserRole.USER) // User만 게시글 작성 가능
    createBoard(@Body() createBoardDto: CreateBoardDto, @GetUser() user: User): Promise<Board> {
        this.logger.verbose(`User ${user.username} creating a new board. Data: ${JSON.stringify(createBoardDto)}`);
        return this.boardsService.createBoard(createBoardDto, user)
    }

    // 게시글 조회 기능
    @Get('/') // GetMapping 핸들러 데코레이터
    getAllBoards(): Promise<Board[]> {
        this.logger.verbose('Retrieving all boards');
        return this.boardsService.getAllBoards();
    }

    // 나의 게시글 조회 기능
    @Get('/myboards') // GetMapping 핸들러 데코레이터
    getMyAllBoards(@GetUser() user: User): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} retrieving their boards`);
        return this.boardsService.getMyAllBoards(user);
    }

    // 특정 번호의 게시글 조회
    @Get('/:id')
    getBoardById(@Param('id') id: number): Promise<Board> {
        this.logger.verbose(`Retrieving board with ID ${id}`);
        return this.boardsService.getBoardById(id);
    }

    // 특정 작성자의 게시글 조회
    @Get('/search/:keyword')
    getBoardsByAuthor(@Query('author') author: string): Promise<Board[]> {
        this.logger.verbose(`Searching boards by author ${author}`);
        return this.boardsService.getBoardsByAuthor(author);
    }

    // 특정 번호의 게시글 삭제
    @Delete('/:id')
    @Roles(UserRole.USER) // USER만 게시글 삭제 가능
    deleteBoardById(@Param('id') id: number, @GetUser() user: User): void {
        this.logger.verbose(`User ${user.username} deleting board with ID ${id}`);
        this.boardsService.deleteBoardById(id, user);
    }

    // 특정 번호의 게시글의 일부 수정 (관리자가 부적절한 글을 비공개로 설정) // 커스텀 파이프 사용은 명시적으로 사용하는 것이 일반적
    @Patch('/:id/status')
    @Roles(UserRole.ADMIN)
    updateBoardStatusById(@Param('id') id: number, @Body('status', BoardStatusValidationPipe) status: BoardStatus, @GetUser() user: User): void {
        this.logger.verbose(`Admin ${user.username} updating status of board ID ${id} to ${status}`);
        this.boardsService.updateBoardStatusById(id, status, user)
    } 

    // 특정 번호의 게시글의 전체 수정
    @Put('/:id')
    updateBoardById(@Param('id') id: number, @Body() updateBoardDto: UpdateBoardDto): void {
        this.logger.verbose(`Updating board with ID ${id}`);
        this.boardsService.updateBoardById(id, updateBoardDto)
    } 
}