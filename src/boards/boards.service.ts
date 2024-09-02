import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { BoardStatus } from "./board-status.enum";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Board)
        private boardsRepository: Repository<Board>
    ){}
        
    // 게시글 작성
    async createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
        const { title, contents } = createBoardDto;
        
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
        return await this.boardsRepository.find();
    }

    // 특정 번호의 게시글 조회
    async getBoardById(id: number): Promise<Board>{
        const foundBoard = await this.boardsRepository.findOneBy({id});
        if(!foundBoard){
            throw new NotFoundException(`Board with ID ${id} not found`);
        }
        return foundBoard;
    }

    // 특정 작성자의 게시글 조회
    async getBoardByAuthor(author: string): Promise<Board[]>{
        const foundBoards = await this.boardsRepository.findBy({author});
        if (foundBoards.length === 0) {
            throw new NotFoundException(`No boards found for author ${author}`);
          }
        return foundBoards;
    }

    // 특정 번호의 게시글 삭제
    async deleteBoardById(id: number): Promise<void> {
        const foundBoard = await this.getBoardById(id); // 게시글 조회
        await this.boardsRepository.remove(foundBoard); // 게시글 삭제
    }

    // 특정 번호의 게시글의 일부 수정
    async updateBoardStatusById(id: number, status: BoardStatus): Promise<void> {
        const result = await this.boardsRepository.update(id, { status });
        if (result.affected === 0) {
          throw new NotFoundException(`Board with ID ${id} not found`);
        }
    }

    // 특정 번호의 게시글의 전체 수정
    async updateBoardById(id: number, updateBoardDto: UpdateBoardDto): Promise<void> {
        const foundBoard = await this.getBoardById(id); // 게시글 조회
        const { author, title, contents, status } = updateBoardDto; // DTO에서 데이터 추출
    
        // 게시글 속성 업데이트
        foundBoard.author = author;
        foundBoard.title = title;
        foundBoard.contents = contents;
        foundBoard.status = status;
    
        await this.boardsRepository.save(foundBoard); // 변경 사항 저장
    }
}