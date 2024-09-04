import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Board } from './board.entity';
import { BoardStatus } from "./board-status.enum";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardRequestDto } from './dto/update-board-request.dto';
import { CreateBoardRequestDto } from './dto/create-board-request.dto';
import { User } from 'src/auth/user.entity';
import { UserRole } from 'src/auth/user-role.enum';

@Injectable()
export class BoardsService {
    private readonly logger = new Logger(BoardsService.name); // Logger 인스턴스 생성

    constructor(
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>
    ){}
        
    // 게시글 작성
    async createBoard(createBoardRequestDto: CreateBoardRequestDto, user: User): Promise<Board> {
        this.logger.verbose(`User ${user.username} is creating a new board with title: ${createBoardRequestDto.title}`);

        const { title, contents } = createBoardRequestDto;
        
        const board = this.boardsRepository.create({
          author: user.username,
          title,
          contents,
          status: BoardStatus.PUBLIC,
          user,
        });
    
        return await this.boardsRepository.save(board);
    }

    // 전체 게시글 조회
    async getAllBoards(): Promise<Board[]> {
        this.logger.verbose('Retrieving all boards');
        return await this.boardsRepository.find();
    }

    // 나의 게시글 조회
    async getMyAllBoards(user: User): Promise<Board[]> {
        this.logger.verbose(`User ${user.username} is retrieving their own boards`);
        return this.boardsRepository.createQueryBuilder('board')
            .where('board.userId = :userId', { userId : user.id })
            .getMany();
    }

    // 특정 번호의 게시글 조회
    async getBoardById(id: number): Promise<Board>{
        this.logger.verbose(`Retrieving board with ID ${id}`);
        const foundBoard = await this.boardsRepository.findOneBy({id});
        if(!foundBoard){
            this.logger.warn(`Board with ID ${id} not found`);
            throw new NotFoundException(`Board with ID ${id} not found`);
        }
        return foundBoard;
    }

    // 특정 작성자의 게시글 조회
    async getBoardsByAuthor(author: string): Promise<Board[]>{
        this.logger.verbose(`Retrieving boards by author: ${author}`);
        const foundBoards = await this.boardsRepository.findBy({author});
        if (foundBoards.length === 0) {
            this.logger.warn(`No boards found for author ${author}`);
            throw new NotFoundException(`No boards found for author ${author}`);
          }
        return foundBoards;
    }

    // 특정 번호의 게시글 삭제
    async deleteBoardById(id: number, user: User): Promise<void> {
        this.logger.verbose(`User ${user.username} is attempting to delete board with ID ${id}`);
        const foundBoard = await this.getBoardById(id); // 게시글 조회
        // 작성자와 요청한 사용자가 같은지 확인
        if (foundBoard.user.id !== user.id) {
            this.logger.warn(`User ${user.username} attempted to delete board ID ${id} without permission`);
            throw new UnauthorizedException(`You do not have permission to delete this board`);
        }
        await this.boardsRepository.remove(foundBoard); // 게시글 삭제
        this.logger.verbose(`Board with ID ${id} deleted by User ${user.username}`);
    }

    // 특정 번호의 게시글의 일부 수정(관리자가 부적절한 글을 비공개로 설정)
    async updateBoardStatusById(id: number, status: BoardStatus, user: User): Promise<void> {
        this.logger.verbose(`User ${user.username} is attempting to update the status of board with ID ${id} to ${status}`);
        // 관리자인지 확인
        if (user.role === UserRole.ADMIN) {
            // 관리자는 상태를 변경할 수 있음
            const result = await this.boardsRepository.update(id, { status });
            if (result.affected === 0) {
                this.logger.warn(`No board found to update with ID ${id}`);
                throw new NotFoundException(`There's no updated record or Board with ID ${id} not found`);
            }
            this.logger.verbose(`Board with ID ${id} status updated to ${status} by Admin ${user.username}`);
        } else {
            this.logger.warn(`User ${user.username} attempted to update board status without permission`);
            // 일반 사용자는 상태 변경 권한이 없음
            throw new UnauthorizedException(`You do not have permission to update the status of this board`);
        }
    }

    // 특정 번호의 게시글의 전체 수정
    async updateBoardById(id: number, updateBoardRequestDto: UpdateBoardRequestDto): Promise<void> {
        this.logger.verbose(`Attempting to update board with ID ${id}`);

        const foundBoard = await this.getBoardById(id); // 게시글 조회
        const { author, title, contents, status } = updateBoardRequestDto; // DTO에서 데이터 추출
    
        // 게시글 속성 업데이트
        foundBoard.author = author;
        foundBoard.title = title;
        foundBoard.contents = contents;
        foundBoard.status = status;
    
        await this.boardsRepository.save(foundBoard); // 변경 사항 저장
        this.logger.verbose(`Board with ID ${id} updated successfully`);
    }
}