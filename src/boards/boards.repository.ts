import { DataSource, Repository } from 'typeorm';
import { Board } from './board.entity';

export class BoardsRepository extends Repository<Board> {
    constructor(dataSource: DataSource) {
      super(Board, dataSource.createEntityManager());
    }
  
    // 쿼리 커스텀이 필요한 경우 아래처럼 커스텀 메서드 아래와 같이 추가한다.
    // async findByAuthor(author: string): Promise<Board[]> {
    //   return this.createQueryBuilder('board')
    //     .where('board.author = :author', { author })
    //     .getMany();
    // }
  }