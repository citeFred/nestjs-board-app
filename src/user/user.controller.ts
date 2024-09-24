import { Body, Controller, Get, Logger, Param, Patch, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { ApiResponse } from 'src/common/api-response.dto';
import { UserWithProfilePictureResponseDto } from './dto/user-with-profile-picture-response.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfilePictureService } from 'src/file/profile-picture/profile-picture.service';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService, private profilePictureService: ProfilePictureService
    ){}

    // 특정 번호의 회원 정보 조회
    @Get(':id')
    async getUserById(
        @Param('id') id: number
    ): Promise<ApiResponse<UserWithProfilePictureResponseDto>> {
        this.logger.verbose(`Retrieving User with ID ${id}`);
        const user = await this.userService.getUserByIdWithProfile(id);
        const userDto = new UserWithProfilePictureResponseDto(user);
        this.logger.verbose(`User retrieved successfully: ${JSON.stringify(userDto)}`);
        return new ApiResponse(true, 200, 'User retrieved successfully', userDto);
    }

    // 회원 정보 수정
    @Patch(':id')
    @UseInterceptors(FileInterceptor('profilePicture'))
    async updateUser(
        @Param('id') id: number,
        @Body() updateUserRequestDto: UpdateUserRequestDto,
        @UploadedFile() file?: Express.Multer.File
    ): Promise<ApiResponse<UserWithProfilePictureResponseDto>> {
        this.logger.verbose(`Updating User with ID ${id}`);
        const updatedUser = await this.userService.updateUser(id, updateUserRequestDto);

        if (file) {
            await this.profilePictureService.uploadProfilePicture(file, updatedUser);
        }

        const userDto = new UserWithProfilePictureResponseDto(updatedUser);
        this.logger.verbose(`User updated successfully: ${JSON.stringify(userDto)}`);
        return new ApiResponse(true, 200, 'User updated successfully', userDto);
    }
}
