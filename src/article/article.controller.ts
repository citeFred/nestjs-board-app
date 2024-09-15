import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleStatus } from './article-status.enum';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { ArticleStatusValidationPipe } from './pipes/article-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from "src/user/user.entity";
import { ApiResponse } from 'src/common/api-response.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from 'src/file/attachment/attachment.service';

@Controller('api/articles')
@UseGuards(AuthGuard('jwt'), RolesGuard) // JWT 인증과 role 커스텀 가드를 적용
export class ArticleController {
    private readonly logger = new Logger(ArticleController.name); // Logger 인스턴스 생성

    // 생성자 주입(DI)
    constructor(private articleService: ArticleService, private attachmentService: AttachmentService){} 
    
    // 게시글 작성 기능
    @Post('/')
    @UseInterceptors(FileInterceptor('articleFile'))
    @Roles(UserRole.USER)
    async createArticle(@Body() createArticleRequestDto: CreateArticleRequestDto, @GetUser() user: User, @UploadedFile() file: Express.Multer.File): Promise<ApiResponse<ArticleResponseDto>> {
        this.logger.verbose(`User ${user.username} creating a new Article. Data: ${JSON.stringify(createArticleRequestDto)}`);
        const article = await this.articleService.createArticle(createArticleRequestDto, user);

        if (file) {
            await this.attachmentService.uploadArticleFiles(file, article);
        }

        const articleDto = new ArticleResponseDto(article);
        this.logger.verbose(`Article created successfully: ${JSON.stringify(articleDto)}`);
        return new ApiResponse(true, 201, 'Article created successfully', articleDto);
    }

    // 전체 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER)
    async getAllArticles(): Promise<ApiResponse<ArticleResponseDto[]>> {
        this.logger.verbose('Retrieving all Articles');
        const articles = await this.articleService.getAllArticles();
        const articleDtos = articles.map(article => new ArticleResponseDto(article));
        this.logger.verbose(`All articles retrieved successfully: ${JSON.stringify(articleDtos)}`);
        return new ApiResponse(true, 200, 'All articles retrieved successfully', articleDtos);
    }

    // 페이징 처리된 게시글 조회
    @Get('/paginated')
    async getPaginatedArticles( @Query('page') page: number = 1, @Query('limit') limit: number = 10 ): Promise<ApiResponse<ArticleResponseDto[]>> {
        this.logger.verbose(`Retrieving paginated articles: page ${page}, limit ${limit}`);
        const articles = await this.articleService.getPaginatedArticles(page, limit);
        const articleDtos = articles.map(article => new ArticleResponseDto(article));
        this.logger.verbose(`Paginated articles retrieved successfully`);
        return new ApiResponse(true, 200, 'Paginated articles retrieved successfully', articleDtos);
    }

    // 나의 게시글 조회 기능
    @Get('/myarticles')
    async getMyAllArticles(@GetUser() user: User): Promise<ApiResponse<ArticleResponseDto[]>> {
        this.logger.verbose(`User ${user.username} retrieving their Articles`);
        const articles = await this.articleService.getMyAllArticles(user);
        const articleDtos = articles.map(article => new ArticleResponseDto(article));
        this.logger.verbose(`User articles retrieved successfully: ${JSON.stringify(articleDtos)}`);
        return new ApiResponse(true, 200, 'User articles retrieved successfully', articleDtos);
    }

    // 특정 번호의 게시글 조회
    @Get('/:id')
    async getArticleById(@Param('id') id: number): Promise<ApiResponse<ArticleResponseDto>> {
        this.logger.verbose(`Retrieving Article with ID ${id}`);
        const article = await this.articleService.getArticleById(id);
        const articleDto = new ArticleResponseDto(article);
        this.logger.verbose(`Article retrieved successfully: ${JSON.stringify(articleDto)}`);
        return new ApiResponse(true, 200, 'Article retrieved successfully', articleDto);
    }

    // 특정 작성자의 게시글 조회
    @Get('/search')
    async getArticlesByAuthor(@Query('author') author: string): Promise<ApiResponse<ArticleResponseDto[]>> {
        this.logger.verbose(`Searching Articles by author ${author}`);
        const articles = await this.articleService.getArticlesByAuthor(author);
        const articleDtos = articles.map(article => new ArticleResponseDto(article));
        this.logger.verbose(`Articles retrieved by author successfully: ${JSON.stringify(articleDtos)}`);
        return new ApiResponse(true, 200, 'Articles retrieved by author successfully', articleDtos);
    }

    // 특정 번호의 게시글 삭제
    @Delete('/:id')
    @Roles(UserRole.USER)
    async deleteArticleById(@Param('id') id: number, @GetUser() user: User): Promise<ApiResponse<void>> {
        this.logger.verbose(`User ${user.username} deleting Article with ID ${id}`);
        await this.articleService.deleteArticleById(id, user);
        this.logger.verbose(`Article deleted successfully with ID ${id}`);
        return new ApiResponse(true, 200, 'Article deleted successfully');
    }

    // 특정 번호의 게시글의 일부 수정 (관리자가 부적절한 글을 비공개로 설정)
    @Patch('/:id/status')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(@Param('id') id: number, @Body('status', ArticleStatusValidationPipe) status: ArticleStatus, @GetUser() user: User): Promise<ApiResponse<void>> {
        this.logger.verbose(`Admin ${user.username} updating status of Article ID ${id} to ${status}`);
        await this.articleService.updateArticleStatusById(id, status, user);
        this.logger.verbose(`Article status updated successfully for ID ${id} to ${status}`);
        return new ApiResponse(true, 200, 'Article status updated successfully');
    }

    // 특정 번호의 게시글의 전체 수정
    @Put('/:id')
    async updateArticleById(@Param('id') id: number, @Body() updateArticleRequestDto: UpdateArticleRequestDto): Promise<ApiResponse<void>> {
        this.logger.verbose(`Updating Article with ID ${id}`);
        await this.articleService.updateArticleById(id, updateArticleRequestDto);
        this.logger.verbose(`Article updated successfully with ID ${id}`);
        return new ApiResponse(true, 200, 'Article updated successfully');
    }
}