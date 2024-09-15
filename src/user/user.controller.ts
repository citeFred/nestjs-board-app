import { Controller, Get, Logger, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/custom-role.guard';
import { ApiResponse } from 'src/common/api-response.dto';
import { UserWithProfilePictureResponseDto } from './dto/user-with-profile-picture-response.dto';

@Controller('api/users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
    private readonly logger = new Logger(UserController.name);

    constructor(private userService: UserService){}

    // 특정 번호의 회원 정보 조회
    @Get(':id')
    async getUserById(
        @Param('id') id: number
    ): Promise<ApiResponse<UserWithProfilePictureResponseDto>> {
        this.logger.verbose(`Retrieving User with ID ${id}`);
        const user = await this.userService.findOneByIdWithFiles(id);
        const userDto = new UserWithProfilePictureResponseDto(user);
        this.logger.verbose(`User retrieved successfully: ${JSON.stringify(userDto)}`);
        return new ApiResponse(true, 200, 'User retrieved successfully', userDto);
    }
}
