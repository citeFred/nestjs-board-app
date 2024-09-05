import { ConflictException, Injectable, UnauthorizedException, Logger, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "src/user/user.entity";
import { Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import * as bcrypt from 'bcryptjs';
import { SignInRequestDto } from './dto/sign-in-request.dto';
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
    async signUp(signUpRequestDto: SignUpRequestDto): Promise<User> {
        const { username, password, email, role, postalCode, address, detailAddress } = signUpRequestDto;
        this.logger.verbose(`Attempting to sign up user with email: ${email}`);

        // 이메일 중복 확인
        await this.checkEmailExists(email);

        // 비밀번호 해싱
        const hashedPassword = await this.hashPassword(password);

        const user = this.usersRepository.create({
            username,
            password: hashedPassword, // 해싱된 비밀번호 사용
            email,
            role,
            postalCode,
            address,
            detailAddress,
        });

        const savedUser = await this.usersRepository.save(user);

        this.logger.verbose(`User signed up successfully with email: ${email}`);
        this.logger.debug(`User details: ${JSON.stringify(savedUser)}`);

        return savedUser;
    }

    // 로그인
    async signIn(signInRequestDto: SignInRequestDto): Promise<{ accessToken: string, user: User }> {
        const { email, password } = signInRequestDto;
        this.logger.verbose(`Attempting to sign in user with email: ${email}`);

        try {
            const existingUser = await this.findUserByEmail(email);

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                this.logger.warn(`Failed login attempt for email: ${email}`);
                throw new UnauthorizedException('Incorrect email or password.');
            }
            // [1] JWT 토큰 생성 (Secret + Payload)
            const payload = { 
                email: existingUser.email,
                username: existingUser.username,
                role: existingUser.role
             };
            const accessToken = await this.jwtService.sign(payload);
            this.logger.verbose(`User signed in successfully with email: ${email}`);
            this.logger.debug(`Generated JWT Token: ${accessToken}`);
            this.logger.debug(`User details: ${JSON.stringify(existingUser)}`);

            // [2] 사용자 정보 반환
            return { accessToken, user: existingUser };
        } catch (error) {
            this.logger.error('Signin failed', error.stack);
            throw error;
        }
    }

    // 이메일 중복 확인 메서드
    private async checkEmailExists(email: string): Promise<void> {
        this.logger.verbose(`Checking if email exists: ${email}`);

        const existingUser = await this.findUserByEmail(email);
        if (existingUser) {
            this.logger.warn(`Email already exists: ${email}`);
            throw new ConflictException('Email already exists');
        }
        this.logger.verbose(`Email is available: ${email}`);
    }

    // 이메일로 유저 찾기 메서드
    private async findUserByEmail(email: string): Promise<User | undefined> {
        return await this.usersRepository.findOne({ where: { email } });
    }

    // 비밀번호 해싱 암호화 메서드
    private async hashPassword(password: string): Promise<string> {
        this.logger.verbose(`Hashing password`);

        const salt = await bcrypt.genSalt(); // 솔트 생성
        return await bcrypt.hash(password, salt); // 비밀번호 해싱
    }
}