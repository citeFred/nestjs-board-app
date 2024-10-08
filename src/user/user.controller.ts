import { Body, Controller, Delete, Get, Logger, Param, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { ApiResponse } from 'src/common/api-response.dto';
import { UserWithProfilePictureResponseDto } from './dto/user-with-profile-picture-response.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from "src/user/entities/user.entity";
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './entities/user-role.enum';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService){}

    // 특정 번호의 회원 정보 조회
    @Get(':id')
    async getUserById(
        @Param('id') id: number,
    ): Promise<ApiResponse<UserWithProfilePictureResponseDto>> {
        this.logger.verbose(`Retrieving User with ID ${id}`);
        const foundUser = await this.userService.getUserByIdWithProfile(id);
        const userDto = new UserWithProfilePictureResponseDto(foundUser);
        this.logger.verbose(`User retrieved successfully: ${JSON.stringify(userDto)}`);
        return new ApiResponse(true, 200, 'User retrieved successfully', userDto);
    }

    // 회원 정보 수정
    @Put(':id')
    @UseInterceptors(FileInterceptor('profilePicture'))
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserRequestDto: UpdateUserRequestDto,
        @GetUser() logginedUser: User,
        @UploadedFile() file?: Express.Multer.File,
    ): Promise<ApiResponse<UserWithProfilePictureResponseDto>> {
        this.logger.verbose(`User ${logginedUser.username} updating User details with ID ${id}`);
        const updatedUser = await this.userService.updateUser(id, updateUserRequestDto, logginedUser, file);
        const userWithProfilePictureResponseDto = new UserWithProfilePictureResponseDto(updatedUser);
        this.logger.verbose(`User updated successfully: ${JSON.stringify(userWithProfilePictureResponseDto)}`);
        return new ApiResponse(true, 200, 'User updated successfully', userWithProfilePictureResponseDto);
    }

    // 특정 번호의 회원 탈퇴
    @Delete(':id')
    @Roles(UserRole.USER)
    async deleteUserById(
        @Param('id') id: number,
        @GetUser() logginedUser: User
    ): Promise<ApiResponse<void>> {
        this.logger.verbose(`User ${logginedUser.username} deleting User with ID ${id}`);
        await this.userService.deleteUserById(id, logginedUser);
        this.logger.verbose(`User deleted successfully with ID ${id}`);
        return new ApiResponse(true, 200, 'User deleted successfully');
    }
}
