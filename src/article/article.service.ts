import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Article } from './entities/article.entity';
import { ArticleStatus } from "./entities/article-status.enum";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { User } from "src/user/entities/user.entity";
import { UserRole } from 'src/user/entities/user-role.enum';
import { ArticlePaginatedResponseDto } from './dto/article-paginated-response.dto';
import { ArticleWithAttachmentAndUserResponseDto } from './dto/article-with-attachment-user-response.dto';
import { AttachmentService } from 'src/file/attachment/attachment.service';

@Injectable()
export class ArticleService {
    private readonly logger = new Logger(ArticleService.name);

    constructor(
        @InjectRepository(Article)
        private articleRepository: Repository<Article>,
        private attachmentService: AttachmentService
    ) {}
        
    // 게시글 작성
    async createArticle(createArticleRequestDto: CreateArticleRequestDto, logginedUser: User, file?: Express.Multer.File): Promise<Article> {
        this.logger.verbose(`User ${logginedUser.username} is creating a new Article with title: ${createArticleRequestDto.title}`);
        
        const newArticle = this.articleRepository.create(
            Object.assign({}, createArticleRequestDto, { 
                author: logginedUser,
                status: ArticleStatus.PUBLIC,
            })
        );

        const savedArticle = await this.articleRepository.save(newArticle);

        if (file) {
            await this.attachmentService.uploadArticleFiles(file, savedArticle);
        }
    
        this.logger.verbose(`Article created successfully: ${JSON.stringify(savedArticle)}`);
        this.logger.debug(`Article details: ${JSON.stringify(savedArticle)}`);
        return savedArticle;
    }

    // 전체 게시글 조회
    async getAllArticles(): Promise<Article[]> {
        this.logger.verbose('Retrieving all Articles');
        const foundArticles = await this.articleRepository.find();
        this.logger.verbose(`All articles retrieved successfully: ${JSON.stringify(foundArticles)}`);
        return foundArticles;
    }

    // 페이징 추가 게시글 조회 기능
    async getPaginatedArticles(page: number, limit: number): Promise<ArticlePaginatedResponseDto> {
        this.logger.verbose(`Retrieving paginated articles: page ${page}, limit ${limit}`);
        const skip: number = (page - 1) * limit;
    
        const [foundArticles, totalCount] = await this.articleRepository.createQueryBuilder("article")
            .leftJoinAndSelect("article.author", "user")
            .skip(skip)
            .take(limit)
            .orderBy("article.createdAt", "DESC") // 내림차순
            .getManyAndCount();
    
        const articleDtos = foundArticles.map(foundArticle => new ArticleWithAttachmentAndUserResponseDto(foundArticle));
        this.logger.verbose(`Paginated articles retrieved successfully`);
        return new ArticlePaginatedResponseDto(articleDtos, totalCount);
    }
    
    // 나의 게시글 조회
    async getMyAllArticles(user: User): Promise<Article[]> {
        this.logger.verbose(`User ${user.username} is retrieving their own Articles`);
        const foundArticles = await this.articleRepository.createQueryBuilder('article')
            .where('article.author.id = :userId', { userId : user.id })
            .getMany(); 
        this.logger.verbose(`User ${user.username} retrieved their own Articles: ${JSON.stringify(foundArticles)}`);
        return foundArticles; 
    }

    // 특정 번호의 게시글 조회
    async getArticleById(id: number): Promise<Article> {
        this.logger.verbose(`Retrieving Article with ID ${id}`);
        const foundArticle = await this.articleRepository.createQueryBuilder("article")
            .leftJoinAndSelect("article.attachments", "attachment")
            .leftJoinAndSelect("article.author", "user")
            .where("article.id = :id", { id })
            .getOne();

        if (!foundArticle) {
            this.logger.warn(`Article with ID ${id} not found`);
            throw new NotFoundException(`Article with ID ${id} not found`);
        }
        this.logger.verbose(`Article retrieved successfully with ID ${id}: ${JSON.stringify(foundArticle)}`);
        return foundArticle;
    }

    // 특정 작성자의 게시글 조회
    async getArticlesByAuthor(author: User): Promise<Article[]> {
        this.logger.verbose(`Retrieving Articles by author: ${author.username}`);
        const foundArticles = await this.articleRepository.find({ where : { author: author }});
        if (foundArticles.length === 0) {
            this.logger.warn(`No Articles found for author ${author.username}`);
            throw new NotFoundException(`No Articles found for author ${author.username}`);
        }
        this.logger.verbose(`Articles retrieved by author ${author.username}: ${JSON.stringify(foundArticles)}`);
        return foundArticles;
    }

    // 특정 번호의 게시글 삭제
    async deleteArticleById(id: number, logginedUser: User): Promise<void> {
        this.logger.verbose(`User ${logginedUser.username} is attempting to delete Article with ID ${id}`);
        const foundArticle = await this.getArticleById(id);
        if (foundArticle.author.id !== logginedUser.id) {
            this.logger.warn(`User ${logginedUser.username} attempted to delete Article ID ${id} without permission`);
            throw new UnauthorizedException(`You do not have permission to delete this Article`);
        }
        await this.articleRepository.remove(foundArticle);
        this.logger.verbose(`Article with ID ${id} deleted by User ${logginedUser.username}`);
    }

    // 특정 번호의 게시글의 일부 수정(관리자가 부적절한 글을 비공개로 설정)
    async updateArticleStatusById(id: number, status: ArticleStatus, logginedUser: User): Promise<void> {
        this.logger.verbose(`User ${logginedUser.username} is attempting to update the status of Article with ID ${id} to ${status}`);
        if (logginedUser.role === UserRole.ADMIN) {
            const updatedArticle = await this.articleRepository.update(id, { status });
            if (updatedArticle.affected === 0) {
                this.logger.warn(`No Article found to update with ID ${id}`);
                throw new NotFoundException(`There's no updated record or Article with ID ${id} not found`);
            }
            this.logger.verbose(`Article with ID ${id} status updated to ${status} by Admin ${logginedUser.username}`);
        } else {
            this.logger.warn(`User ${logginedUser.username} attempted to update Article status without permission`);
            throw new UnauthorizedException(`You do not have permission to update the status of this Article`);
        }
    }

    // 특정 번호의 게시글의 전체 수정
    async updateArticleById(id: number, updateArticleRequestDto: UpdateArticleRequestDto, logginedUser: User, file?: Express.Multer.File): Promise<Article> {
        this.logger.verbose(`Attempting to update Article with ID ${id}`);
        
        const foundArticle = await this.getArticleById(id);

        if (foundArticle.author.id !== logginedUser.id) {
            this.logger.warn(`User ${logginedUser.username} attempted to update Article details ${id} without permission`);
            throw new UnauthorizedException(`You do not have permission to update this Article`);
        }

        Object.assign(foundArticle, updateArticleRequestDto);

        if (file) {
            await this.attachmentService.uploadArticleFiles(file, foundArticle);
        }
    
        const updatedArticle = await this.articleRepository.save(foundArticle);

        this.logger.verbose(`Article with ID ${id} updated successfully: ${JSON.stringify(updatedArticle)}`);
        return updatedArticle;
    }
}