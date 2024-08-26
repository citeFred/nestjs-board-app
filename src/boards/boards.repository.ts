// import { EntityRepository, Repository } from 'typeorm';
// import { Board } from './board.entity';

// @EntityRepository(Board)
// export class BoardsRepository extends Repository<Board> {
//  커스텀 메서드 예제

//   async findByAuthor(author: string): Promise<Board[]> {
//     return this.find({ where: { author } });
//   }

//   async findOneById(id: number): Promise<Board | undefined> {
//     return this.findOneBy({ id });
//   }
// }