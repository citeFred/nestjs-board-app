import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { ArticleController } from './article.controller';
import { AttachmentModule } from 'src/file/attachment/attachment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    AttachmentModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService],
  exports: [ArticleService],
})
export class ArticleModule {}
