import { ConflictException, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "src/user/entities/user.entity";
import { Repository } from 'typeorm';
import { SignUpRequestDto } from './dto/sign-up-request.dto';
import * as bcrypt from 'bcryptjs';
import { SignInRequestDto } from './dto/sign-in-request.dto';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from 'src/user/user.service';
import { ProfilePictureService } from 'src/file/profile-picture/profile-picture.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private httpService: HttpService,
        private userService: UserService,
        private profilePictureService: ProfilePictureService
    ) {}

    // 회원 가입
    async signUp(signUpRequestDto: SignUpRequestDto, file?: Express.Multer.File): Promise<User> {
        this.logger.verbose(`Attempting to sign up user with email: ${signUpRequestDto.email}`);

        // 이메일 중복 확인
        await this.checkEmailExists(signUpRequestDto.email);

        // 비밀번호 해싱
        const hashedPassword = await this.hashPassword(signUpRequestDto.password);

        const newUser = this.usersRepository.create(
            Object.assign({}, signUpRequestDto, { password: hashedPassword })
        );

        const savedUser = await this.usersRepository.save(newUser);

        if (file) {
            await this.profilePictureService.uploadProfilePicture(file, savedUser);
        }

        this.logger.verbose(`User signed up successfully with email: ${savedUser.email}`);
        this.logger.debug(`User details: ${JSON.stringify(savedUser)}`);
        return savedUser;
    }

    // 로그인
    async signIn(signInRequestDto: SignInRequestDto): Promise<{ jwtToken: string, user: User }> {
        const { email, password } = signInRequestDto;
        this.logger.verbose(`Attempting to sign in user with email: ${email}`);

        try {
            const existingUser = await this.findUserByEmail(email);

            if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
                this.logger.warn(`Failed login attempt for email: ${email}`);
                throw new UnauthorizedException('Incorrect email or password.');
            }

            // 프로필 사진 포함하여 사용자 정보 가져오기
            const userWithFiles = await this.userService.getUserByIdWithProfile(existingUser.id);

            // [1] JWT 토큰 생성 (Secret + Payload)
            const jwtToken = await this.generateJwtToken(userWithFiles);

            // [2] 사용자 정보 반환
            return { jwtToken, user: userWithFiles };
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

    // 카카오 정보 회원 가입
    async signUpWithKakao(kakaoId: string, profile: any): Promise<User> {
        const kakaoAccount = profile.kakao_account;
    
        const kakaoUsername = kakaoAccount.name;
        const kakaoEmail = kakaoAccount.email;
    
        // 카카오 프로필 데이터를 기반으로 사용자 찾기 또는 생성 로직을 구현
        const existingUser = await this.usersRepository.findOne({ where: { email: kakaoEmail } });
        if (existingUser) {
            return existingUser;
        }

        // 비밀번호 필드에 랜덤 문자열 생성
        const temporaryPassword = uuidv4(); // 랜덤 문자열 생성
        const hashedPassword = await this.hashPassword(temporaryPassword);
        
        // 새 사용자 생성 로직
        const newUser = this.usersRepository.create({
            username: kakaoUsername,
            email: kakaoEmail,
            password: hashedPassword, // 해싱된 임시 비밀번호 사용

            // 기타 필요한 필드 설정
        });
        return this.usersRepository.save(newUser);
    }

    // 카카오 로그인
    async signInWithKakao(kakaoAuthResCode: string): Promise<{ jwtToken: string, user: User }> {
        // Authorization Code로 Kakao API에 Access Token 요청
        const accessToken = await this.getKakaoAccessToken(kakaoAuthResCode);

        // Access Token으로 Kakao 사용자 정보 요청
        const kakaoUserInfo = await this.getKakaoUserInfo(accessToken);

        // 카카오 사용자 정보를 기반으로 회원가입 또는 로그인 처리
        const user = await this.signUpWithKakao(kakaoUserInfo.id.toString(), kakaoUserInfo);

        // [1] JWT 토큰 생성 (Secret + Payload)
        const jwtToken = await this.generateJwtToken(user);

        // [2] 사용자 정보 반환
        return { jwtToken, user };
    }

    // Kakao Authorization Code로 Access Token 요청
    async getKakaoAccessToken(code: string): Promise<string> {
        const tokenUrl = 'https://kauth.kakao.com/oauth/token';
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID, // Kakao REST API Key
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code,
            client_secret: process.env.KAKAO_CLIENT_SECRET // 필요시 사용
        };
    
        const response = await firstValueFrom(this.httpService.post(tokenUrl, null, {
            params: payload,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }));
    
        return response.data.access_token;  // Access Token 반환
    }

    // Access Token으로 Kakao 사용자 정보 요청
    async getKakaoUserInfo(accessToken: string): Promise<any> {
        const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
        const response = await firstValueFrom(this.httpService.get(userInfoUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }));
        this.logger.debug(`Kakao User Info: ${JSON.stringify(response.data)}`); // 데이터 확인
        return response.data;
    }

    // JWT 생성 공통 메서드
    async generateJwtToken(user: User): Promise<string> {
        let profilePictureUrl: string | null = null;
        
        if (user.profilePictures && user.profilePictures.length > 0) {
            await user.profilePictures;
            const lastPicture = user.profilePictures[user.profilePictures.length - 1]; // 배열의 마지막 요소
            profilePictureUrl = lastPicture.url; // URL 설정
        }
        // [1] JWT 토큰 생성 (Secret + Payload)
        const payload = { 
            username: user.username,
            email: user.email,
            userId: user.id,
            role: user.role,
            profilePictureUrl
            };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token: ${accessToken}`);
        this.logger.debug(`User details: ${JSON.stringify(user)}`);
        return accessToken;
    }
}