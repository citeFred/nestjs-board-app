import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ArticleService } from './article.service';
import { Article } from './article.entity';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleStatus } from './article-status.enum';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { ArticleStatusValidationPipe } from './pipes/article-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/auth/user-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('api/articles')
@UseGuards(AuthGuard('jwt'), RolesGuard) // JWT 인증과 role 커스텀 가드를 적용
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name); // Logger 인스턴스 생성

    // 생성자 주입(DI)
    constructor(private ArticleService: ArticleService){}
    
    // 게시글 작성 기능
    @Post('/') // ArticleMapping 핸들러 데코레이터
    @Roles(UserRole.USER) // User만 게시글 작성 가능
    createArticle(@Body() createArticleRequestDto: CreateArticleRequestDto, @GetUser() user: User): Promise<Article> {
        this.logger.verbose(`User ${user.username} creating a new Article. Data: ${JSON.stringify(createArticleRequestDto)}`);
        return this.ArticleService.createArticle(createArticleRequestDto, user)
    }

    // 게시글 조회 기능
    @Get('/') // GetMapping 핸들러 데코레이터
    getAllArticles(): Promise<Article[]> {
        this.logger.verbose('Retrieving all Articles');
        return this.ArticleService.getAllArticles();
    }

    // 나의 게시글 조회 기능
    @Get('/myarticles') // GetMapping 핸들러 데코레이터
    getMyAllArticles(@GetUser() user: User): Promise<Article[]> {
        this.logger.verbose(`User ${user.username} retrieving their Articles`);
        return this.ArticleService.getMyAllArticles(user);
    }

    // 특정 번호의 게시글 조회
    @Get('/:id')
    getArticleById(@Param('id') id: number): Promise<Article> {
        this.logger.verbose(`Retrieving Article with ID ${id}`);
        return this.ArticleService.getArticleById(id);
    }

    // 특정 작성자의 게시글 조회
    @Get('/search/:keyword')
    getArticlesByAuthor(@Query('author') author: string): Promise<Article[]> {
        this.logger.verbose(`Searching Articles by author ${author}`);
        return this.ArticleService.getArticlesByAuthor(author);
    }

    // 특정 번호의 게시글 삭제
    @Delete('/:id')
    @Roles(UserRole.USER) // USER만 게시글 삭제 가능
    deleteArticleById(@Param('id') id: number, @GetUser() user: User): void {
        this.logger.verbose(`User ${user.username} deleting Article with ID ${id}`);
        this.ArticleService.deleteArticleById(id, user);
    }

    // 특정 번호의 게시글의 일부 수정 (관리자가 부적절한 글을 비공개로 설정) // 커스텀 파이프 사용은 명시적으로 사용하는 것이 일반적
    @Patch('/:id/status')
    @Roles(UserRole.ADMIN)
    updateArticlestatusById(@Param('id') id: number, @Body('status', ArticleStatusValidationPipe) status: ArticleStatus, @GetUser() user: User): void {
        this.logger.verbose(`Admin ${user.username} updating status of Article ID ${id} to ${status}`);
        this.ArticleService.updateArticleStatusById(id, status, user)
    } 

    // 특정 번호의 게시글의 전체 수정
    @Put('/:id')
    updateArticleById(@Param('id') id: number, @Body() updateArticleRequestDto: UpdateArticleRequestDto): void {
        this.logger.verbose(`Updating Article with ID ${id}`);
        this.ArticleService.updateArticleById(id, updateArticleRequestDto)
    } 
}