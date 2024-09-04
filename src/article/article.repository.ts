// import { EntityRepository, Repository } from 'typeorm';
// import { Article } from './Article.entity';

// @EntityRepository(Article)
// export class ArticlesRepository extends Repository<Article> {
//  커스텀 메서드 예제

//   async findByAuthor(author: string): Promise<Article[]> {
//     return this.find({ where: { author } });
//   }

//   async findOneById(id: number): Promise<Article | undefined> {
//     return this.findOneBy({ id });
//   }
// }