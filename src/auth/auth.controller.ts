import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService){}

    // 회원 가입 기능
    @Post('/signup') // PostMapping 핸들러 데코레이터
    signup(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.authService.createUser(createUserDto);
    }
}
