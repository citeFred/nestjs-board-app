import { Body, Controller, Logger, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';

@Controller('api/auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name); // Logger 인스턴스 생성

    constructor(private authService: AuthService){}

    // 회원 가입 기능
    @Post('/signup') // PostMapping 핸들러 데코레이터
    signUp(@Body() createUserDto: CreateUserDto): Promise<User> {
        this.logger.verbose(`Attempting to sign up user with email: ${createUserDto.email}`);
        return this.authService.signUp(createUserDto);
    }

    // 로그인 기능
    @Post('/signin')
    signIn(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
        this.logger.verbose(`Attempting to sign in user with email: ${loginUserDto.email}`);
        return this.authService.signIn(loginUserDto, res);
    }

    // 인증된 회원이 들어갈 수 있는 테스트 URL 경로
    @Post('/test')
    @UseGuards(AuthGuard()) // @UseGuards : 핸들러는 지정한 인증 가드가 적용됨 -> AuthGuard()의 'jwt'는 기본값으로 생략가능
    testForAuth(@GetUser() user: User) {
        this.logger.verbose(`Authenticated user accessing test route: ${user.email}`);
        return { message: 'You are authenticated', user: user };
    }
}