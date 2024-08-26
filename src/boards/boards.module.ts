import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
// import { BoardsRepository } from './boards.repository'; // 커스텀 리포지토리 파일의 경로

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [ BoardsService ], //   providers: [ BoardsService, BoardsRepository ], // 커스텀 리포지토리 필요한 경우
  exports: [BoardsService],
})
export class BoardsModule {}
