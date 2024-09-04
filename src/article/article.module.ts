import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { ArticleController } from './article.controller';
// import { ArticleRepository } from './Article.repository'; // 커스텀 리포지토리 파일의 경로

@Module({
  imports: [TypeOrmModule.forFeature([Article])],
  providers: [ArticleService], //   providers: [ ArticlesService, ArticlesRepository ], // 커스텀 리포지토리 필요한 경우
  controllers: [ArticleController], // 컨트롤러 등록
  exports: [ArticleService],
})
export class ArticleModule {}
