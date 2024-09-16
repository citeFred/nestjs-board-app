import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({id});
  }

  // 회원정보+파일 정보까지 가져오는 별도 메서드(QueryBuilder)
  async findOneByIdWithFiles(id: number): Promise<User> {
    return this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profilePicture', 'profilePicture')
      .where('user.id = :id', { id })
      .getOne();
  }
}
