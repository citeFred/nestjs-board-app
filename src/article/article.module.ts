import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleService } from './article.service';
import { Article } from './entities/article.entity';
import { ArticleController } from './article.controller';
import { FileModule } from 'src/file/file.module';
import { AttachmentService } from 'src/file/attachment/attachment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    FileModule,
  ],
  controllers: [ArticleController],
  providers: [ArticleService, AttachmentService],
  exports: [ArticleService],
})
export class ArticleModule {}
