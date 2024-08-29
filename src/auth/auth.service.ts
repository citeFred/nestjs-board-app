import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './user-role.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ){}

    // 회원 가입
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const { username, password, email, role } = createUserDto;
    
        const user = this.usersRepository.create({
          username,
          password,
          email,
          role,
        });
    
        return await this.usersRepository.save(user);
    }
}

