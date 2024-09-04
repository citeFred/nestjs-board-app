import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article } from './article.entity';
import { ArticleStatus } from "./article-status.enum";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { User } from "src/user/user.entity";
import { UserRole } from 'src/user/user-role.enum';

@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name); // Logger 인스턴스 생성

    constructor(
        @InjectRepository(Article)
        private ArticleRepository: Repository<Article>
    ){}
        
    // 게시글 작성
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, user: User): Promise<Article> {
        this.logger.verbose(`User ${user.username} is creating a new Article with title: ${createArticleRequestDto.title}`);

        const { title, contents } = createArticleRequestDto;
        
        const Article = this.ArticleRepository.create({
          author: user.username,
          title,
          contents,
          status: ArticleStatus.PUBLIC,
          user,
        });
    
        return await this.ArticleRepository.save(Article);
    }

    // 전체 게시글 조회
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose('Retrieving all Article');
        return await this.ArticleRepository.find();
    }

    // 나의 게시글 조회
    async getMyAllArticles(user: User): Promise<Article[]> {
        this.logger.verbose(`User ${user.username} is retrieving their own Article`);
        return this.ArticleRepository.createQueryBuilder('Article')
            .where('Article.userId = :userId', { userId : user.id })
            .getMany();
    }

    // 특정 번호의 게시글 조회
    async getArticleById(id: number): Promise<Article>{
        this.logger.verbose(`Retrieving Article with ID ${id}`);
        const foundArticle = await this.ArticleRepository.findOneBy({id});
        if(!foundArticle){
            this.logger.warn(`Article with ID ${id} not found`);
            throw new NotFoundException(`Article with ID ${id} not found`);
        }
        return foundArticle;
    }

    // 특정 작성자의 게시글 조회
    async getArticlesByAuthor(author: string): Promise<Article[]>{
        this.logger.verbose(`Retrieving Article by author: ${author}`);
        const foundArticle = await this.ArticleRepository.findBy({author});
        if (foundArticle.length === 0) {
            this.logger.warn(`No Article found for author ${author}`);
            throw new NotFoundException(`No Article found for author ${author}`);
          }
        return foundArticle;
    }

    // 특정 번호의 게시글 삭제
    async deleteArticleById(id: number, user: User): Promise<void> {
        this.logger.verbose(`User ${user.username} is attempting to delete Article with ID ${id}`);
        const foundArticle = await this.getArticleById(id); // 게시글 조회
        // 작성자와 요청한 사용자가 같은지 확인
        if (foundArticle.user.id !== user.id) {
            this.logger.warn(`User ${user.username} attempted to delete Article ID ${id} without permission`);
            throw new UnauthorizedException(`You do not have permission to delete this Article`);
        }
        await this.ArticleRepository.remove(foundArticle); // 게시글 삭제
        this.logger.verbose(`Article with ID ${id} deleted by User ${user.username}`);
    }

    // 특정 번호의 게시글의 일부 수정(관리자가 부적절한 글을 비공개로 설정)
    async updateArticleStatusById(id: number, status: ArticleStatus, user: User): Promise<void> {
        this.logger.verbose(`User ${user.username} is attempting to update the status of Article with ID ${id} to ${status}`);
        // 관리자인지 확인
        if (user.role === UserRole.ADMIN) {
            // 관리자는 상태를 변경할 수 있음
            const result = await this.ArticleRepository.update(id, { status });
            if (result.affected === 0) {
                this.logger.warn(`No Article found to update with ID ${id}`);
                throw new NotFoundException(`There's no updated record or Article with ID ${id} not found`);
            }
            this.logger.verbose(`Article with ID ${id} status updated to ${status} by Admin ${user.username}`);
        } else {
            this.logger.warn(`User ${user.username} attempted to update Article status without permission`);
            // 일반 사용자는 상태 변경 권한이 없음
            throw new UnauthorizedException(`You do not have permission to update the status of this Article`);
        }
    }

    // 특정 번호의 게시글의 전체 수정
    async updateArticleById(id: number, updateArticleRequestDto: UpdateArticleRequestDto): Promise<void> {
        this.logger.verbose(`Attempting to update Article with ID ${id}`);

        const foundArticle = await this.getArticleById(id); // 게시글 조회
        const { author, title, contents, status } = updateArticleRequestDto; // DTO에서 데이터 추출
    
        // 게시글 속성 업데이트
        foundArticle.author = author;
        foundArticle.title = title;
        foundArticle.contents = contents;
        foundArticle.status = status;
    
        await this.ArticleRepository.save(foundArticle); // 변경 사항 저장
        this.logger.verbose(`Article with ID ${id} updated successfully`);
    }
}