import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service';
import { Board } from './board.entity';
import { DataSource } from 'typeorm';
import { BoardsRepository } from './boards.repository'; // 리포지토리 파일의 경로

@Module({
  imports: [TypeOrmModule.forFeature([Board])],
  providers: [
    BoardsService,
    
    // CustomRepository가 필요한 경우 다음처럼 DataSource객체를 활용해야 한다.
    { 
      provide: 'BOARDS_REPOSITORY', useFactory: (dataSource: DataSource) => { return new BoardsRepository(dataSource); },
      inject: [DataSource],
    },

  ],
  exports: [BoardsService],
})
export class BoardsModule {}
