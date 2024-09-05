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
        private articleRepository: Repository<Article>
    ){}
        
    // 게시글 작성
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, user: User): Promise<Article> {
        this.logger.verbose(`User ${user.username} is creating a new Article with title: ${createArticleRequestDto.title}`);
        const { title, contents } = createArticleRequestDto;
        const Article = this.articleRepository.create({
          author: user.username,
          title,
          contents,
          status: ArticleStatus.PUBLIC,
          user,
        });
        const savedArticle = await this.articleRepository.save(Article);
        this.logger.verbose(`Article created successfully: ${JSON.stringify(savedArticle)}`);
        return savedArticle;
    }

    // 전체 게시글 조회
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose('Retrieving all Article');
        const articles = await this.articleRepository.find();
        this.logger.verbose(`All articles retrieved successfully: ${JSON.stringify(articles)}`);
        return articles;
    }

    // 페이징 추가 게시글 조회 기능
    async getPaginatedArticles(page: number, limit: number): Promise<Article[]> {
        this.logger.verbose(`Retrieving paginated articles: page ${page}, limit ${limit}`);
        const skip: number = (page - 1) * limit;
        const articles = await this.articleRepository.find({
            skip,
            take: limit,
            order: { createdAt: 'DESC' } // 내림차순
        });
        this.logger.verbose(`Paginated articles retrieved successfully`);
        return articles;
    }
    

    // 나의 게시글 조회
    async getMyAllArticles(user: User): Promise<Article[]> {
        this.logger.verbose(`User ${user.username} is retrieving their own Articles`);
        const articles = await this.articleRepository.createQueryBuilder('article')
            .where('article.userId = :userId', { userId : user.id }) 
            .getMany(); 
        this.logger.verbose(`User ${user.username} retrieved their own Articles: ${JSON.stringify(articles)}`);
        return articles; 
    }

    // 특정 번호의 게시글 조회
    async getArticleById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieving Article with ID ${id}`);
        const foundArticle = await this.articleRepository.findOneBy({id});
        if (!foundArticle) {
            this.logger.warn(`Article with ID ${id} not found`);
            throw new NotFoundException(`Article with ID ${id} not found`);
        }
        this.logger.verbose(`Article retrieved successfully with ID ${id}: ${JSON.stringify(foundArticle)}`);
        return foundArticle;
    }

    // 특정 작성자의 게시글 조회
    async getArticlesByAuthor(author: string): Promise<Article[]> {
        this.logger.verbose(`Retrieving Articles by author: ${author}`);
        const foundArticles = await this.articleRepository.findBy({author});
        if (foundArticles.length === 0) {
            this.logger.warn(`No Articles found for author ${author}`);
            throw new NotFoundException(`No Articles found for author ${author}`);
        }
        this.logger.verbose(`Articles retrieved by author ${author}: ${JSON.stringify(foundArticles)}`);
        return foundArticles;
    }

    // 특정 번호의 게시글 삭제
    async deleteArticleById(id: number, user: User): Promise<void> {
        this.logger.verbose(`User ${user.username} is attempting to delete Article with ID ${id}`);
        const foundArticle = await this.getArticleById(id);
        if (foundArticle.user.id !== user.id) {
            this.logger.warn(`User ${user.username} attempted to delete Article ID ${id} without permission`);
            throw new UnauthorizedException(`You do not have permission to delete this Article`);
        }
        await this.articleRepository.remove(foundArticle);
        this.logger.verbose(`Article with ID ${id} deleted by User ${user.username}`);
    }

    // 특정 번호의 게시글의 일부 수정(관리자가 부적절한 글을 비공개로 설정)
    async updateArticleStatusById(id: number, status: ArticleStatus, user: User): Promise<void> {
        this.logger.verbose(`User ${user.username} is attempting to update the status of Article with ID ${id} to ${status}`);
        if (user.role === UserRole.ADMIN) {
            const result = await this.articleRepository.update(id, { status });
            if (result.affected === 0) {
                this.logger.warn(`No Article found to update with ID ${id}`);
                throw new NotFoundException(`There's no updated record or Article with ID ${id} not found`);
            }
            this.logger.verbose(`Article with ID ${id} status updated to ${status} by Admin ${user.username}`);
        } else {
            this.logger.warn(`User ${user.username} attempted to update Article status without permission`);
            throw new UnauthorizedException(`You do not have permission to update the status of this Article`);
        }
    }

    // 특정 번호의 게시글의 전체 수정
    async updateArticleById(id: number, updateArticleRequestDto: UpdateArticleRequestDto): Promise<void> {
        this.logger.verbose(`Attempting to update Article with ID ${id}`);
        
        const foundArticle = await this.getArticleById(id);
        const { author, title, contents, status } = updateArticleRequestDto;
    
        foundArticle.author = author;
        foundArticle.title = title;
        foundArticle.contents = contents;
        foundArticle.status = status;
    
        await this.articleRepository.save(foundArticle);
        this.logger.verbose(`Article with ID ${id} updated successfully: ${JSON.stringify(foundArticle)}`);
    }
}