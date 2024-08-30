import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService){}

    // 회원 가입 기능
    @Post('/signup') // PostMapping 핸들러 데코레이터
    signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.authService.signUp(createUserDto);
    }

    // 로그인 기능
    @Post('/signin')
    signIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        return this.authService.signIn(loginUserDto, res);
    }
}