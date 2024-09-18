import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Put, Query, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ArticleService } from './article.service';
import { CreateArticleRequestDto } from './dto/create-article-request.dto';
import { ArticleStatus } from './entities/article-status.enum';
import { UpdateArticleRequestDto } from './dto/update-article-request.dto';
import { ArticleStatusValidationPipe } from './pipes/article-status-validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/user/entities/user-role.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from "src/user/entities/user.entity";
import { ApiResponse } from 'src/common/api-response.dto';
import { ArticleResponseDto } from './dto/article-response.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AttachmentService } from 'src/file/attachment/attachment.service';
import { ArticleWithAttachmentAndUserResponseDto } from './dto/article-with-attachment-user-response.dto';
import { ArticlePaginatedResponseDto } from './dto/article-paginated-response.dto';

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
    async createArticle(
        @Body() createArticleRequestDto: CreateArticleRequestDto,
        @GetUser() user: User,
        @UploadedFile() file: Express.Multer.File
    ): Promise<ApiResponse<ArticleWithAttachmentAndUserResponseDto>> {
        this.logger.verbose(`User ${user.username} creating a new Article. Data: ${JSON.stringify(createArticleRequestDto)}`);
        const newArticle = await this.articleService.createArticle(createArticleRequestDto, user);

        if (file) {
            await this.attachmentService.uploadArticleFiles(file, newArticle);
        }

        const articleDto = new ArticleWithAttachmentAndUserResponseDto(newArticle);
        this.logger.verbose(`Article created successfully: ${JSON.stringify(articleDto)}`);
        return new ApiResponse(true, 201, 'Article created successfully', articleDto);
    }

    // 전체 게시글 조회 기능
    @Get('/')
    @Roles(UserRole.USER)
    async getAllArticles(): Promise<ApiResponse<ArticleResponseDto[]>> {
        this.logger.verbose('Retrieving all Articles');
        const foundArticles = await this.articleService.getAllArticles();
        const articleDtos = foundArticles.map(foundArticle => new ArticleResponseDto(foundArticle));
        this.logger.verbose(`All articles retrieved successfully: ${JSON.stringify(articleDtos)}`);
        return new ApiResponse(true, 200, 'All articles retrieved successfully', articleDtos);
    }

    // 페이징 처리된 게시글 조회
    @Get('/paginated')
    async getPaginatedArticles(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 10
    ): Promise<ApiResponse<ArticlePaginatedResponseDto>> {
        this.logger.verbose(`Retrieving paginated articles: page ${page}, limit ${limit}`);
        const paginatedArticles = await this.articleService.getPaginatedArticles(page, limit);
        this.logger.verbose(`Paginated articles retrieved successfully`);
        
        return new ApiResponse(true, 200, 'Paginated articles retrieved successfully', paginatedArticles);
    }
    
    

    // 나의 게시글 조회 기능
    @Get('/myarticles')
    async getMyAllArticles(
        @GetUser() user: User
    ): Promise<ApiResponse<ArticleResponseDto[]>> {
        this.logger.verbose(`User ${user.username} retrieving their Articles`);
        const foundArticles = await this.articleService.getMyAllArticles(user);
        const articleDtos = foundArticles.map(foundArticle => new ArticleResponseDto(foundArticle));
        this.logger.verbose(`User articles retrieved successfully: ${JSON.stringify(articleDtos)}`);
        return new ApiResponse(true, 200, 'User articles retrieved successfully', articleDtos);
    }

    // 특정 번호의 게시글 조회
    @Get('/:id')
    async getArticleById(
        @Param('id') id: number
    ): Promise<ApiResponse<ArticleWithAttachmentAndUserResponseDto>> {
        this.logger.verbose(`Retrieving Article with ID ${id}`);
        const foundArticle = await this.articleService.getArticleById(id);
        const articleDto = new ArticleWithAttachmentAndUserResponseDto(foundArticle);
        this.logger.verbose(`Article retrieved successfully: ${JSON.stringify(articleDto)}`);
        return new ApiResponse(true, 200, 'Article retrieved successfully', articleDto);
    }

    // 특정 작성자의 게시글 조회
    @Get('/search')
    async getArticlesByAuthor(
        @Query('author') author: string
    ): Promise<ApiResponse<ArticleResponseDto[]>> {
        this.logger.verbose(`Searching Articles by author ${author}`);
        const foundArticles = await this.articleService.getArticlesByAuthor(author);
        const articleDtos = foundArticles.map(foundArticle => new ArticleResponseDto(foundArticle));
        this.logger.verbose(`Articles retrieved by author successfully: ${JSON.stringify(articleDtos)}`);
        return new ApiResponse(true, 200, 'Articles retrieved by author successfully', articleDtos);
    }

    // 특정 번호의 게시글 삭제
    @Delete('/:id')
    @Roles(UserRole.USER)
    async deleteArticleById(
        @Param('id') id: number,
        @GetUser() user: User
    ): Promise<ApiResponse<void>> {
        this.logger.verbose(`User ${user.username} deleting Article with ID ${id}`);
        await this.articleService.deleteArticleById(id, user);
        this.logger.verbose(`Article deleted successfully with ID ${id}`);
        return new ApiResponse(true, 200, 'Article deleted successfully');
    }

    // 특정 번호의 게시글의 일부 수정 (관리자가 부적절한 글을 비공개로 설정)
    @Patch('/:id/status')
    @Roles(UserRole.ADMIN)
    async updateArticleStatusById(
        @Param('id') id: number,
        @Body('status', ArticleStatusValidationPipe) status: ArticleStatus,
        @GetUser() user: User
    ): Promise<ApiResponse<void>> {
        this.logger.verbose(`Admin ${user.username} updating status of Article ID ${id} to ${status}`);
        await this.articleService.updateArticleStatusById(id, status, user);
        this.logger.verbose(`Article status updated successfully for ID ${id} to ${status}`);
        return new ApiResponse(true, 200, 'Article status updated successfully');
    }

    // 특정 번호의 게시글의 전체 수정
    @Put('/:id')
    async updateArticleById(
        @Param('id') id: number,
        @Body() updateArticleRequestDto: UpdateArticleRequestDto
    ): Promise<ApiResponse<void>> {
        this.logger.verbose(`Updating Article with ID ${id}`);
        await this.articleService.updateArticleById(id, updateArticleRequestDto);
        this.logger.verbose(`Article updated successfully with ID ${id}`);
        return new ApiResponse(true, 200, 'Article updated successfully');
    }
}