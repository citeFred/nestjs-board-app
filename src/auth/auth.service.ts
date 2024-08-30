import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
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
    async signIn(loginUserDto: LoginUserDto): Promise<string> {
        const { email, password } = loginUserDto;

        const existingUser = await this.findUserByEmail(email);

        if (!existingUser || !(await bcrypt.compare(password, existingUser.password))) {
            throw new UnauthorizedException('Incorrect email or password.');
        }

        return 'login success';
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

