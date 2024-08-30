import { ConflictException, Injectable, UnauthorizedException, Logger, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ){}

    // 회원 가입
    async signUp(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, email, role } = createUserDto;

        // 이메일 중복 확인
        await this.checkEmailExists(email);

        // 비밀번호 해싱
        const hashedPassword = await this.hashPassword(password);

        const user = this.usersRepository.create({
            username,
            password: hashedPassword, // 해싱된 비밀번호 사용
            email,
            role,
        });

        return await this.usersRepository.save(user);
    }

    // 로그인
    async signIn(loginUserDto: LoginUserDto, @Res() res: Response): Promise<void> {
        const { email, password } = loginUserDto;

        try {
            const existingUser = await this.findUserByEmail(email);

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                throw new UnauthorizedException('Incorrect email or password.');
            }
            // JWT 토큰 생성 (Secret + Payload)
            const payload = { 
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role
             };
            const accessToken = await this.jwtService.sign(payload);

            // JWT를 쿠키에 저장
            res.cookie('Authorization', accessToken, {
                httpOnly: true, // 클라이언트 측 스크립트에서 쿠키 접근 금지
                secure: false, // HTTPS에서만 쿠키 전송, 임시 비활성화
                maxAge: 3600000, // 1시간
                sameSite: 'none', // CSRF 공격 방어
            });

            res.send({ message: 'Logged in successfully' });
        } catch (error) {
            this.logger.error('Signin failed', error.stack);
            throw error;
        }
    }

    // 이메일 중복 확인 메서드
    private async checkEmailExists(email: string): Promise<void> {
        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
    }

    // 이메일로 유저 찾기 메서드
    private async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    // 비밀번호 해싱 암호화 메서드
    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(); // 솔트 생성
        return await bcrypt.hash(password, salt); // 비밀번호 해싱
    }
}

