import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({id});
  }

  // 회원정보+파일 정보까지 가져오는 별도 메서드(QueryBuilder)
  async getUserByIdWithProfile(id: number): Promise<User> {
    this.logger.verbose(`Retrieving User with ID ${id}`);
    const foundUser = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.profilePictures', 'ProfilePicture')
      .where('user.id = :id', { id })
      .getOne();

      if (!foundUser) {
        this.logger.warn(`User with ID ${id} not found`);
        throw new NotFoundException(`User with ID ${id} not found`);
    }
    this.logger.verbose(`User retrieved successfully with ID ${id}: ${JSON.stringify(foundUser)}`);
    return foundUser;
  }

  async updateUser(id: number, updateUserRequestDto: UpdateUserRequestDto, file?: Express.Multer.File): Promise<User> {
    this.logger.verbose(`Attempting to update User with ID ${id}`);

    const foundUser = await this.getUserByIdWithProfile(id);
    const { postalCode, address, detailAddress } = updateUserRequestDto;

    if (!foundUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
    }

    // 수정할 필드 업데이트
    foundUser.postalCode = postalCode || foundUser.postalCode;
    foundUser.address = address || foundUser.address;
    foundUser.detailAddress = detailAddress || foundUser.detailAddress;

    await this.userRepository.save(foundUser);
    this.logger.verbose(`User with ID ${id} updated successfully: ${JSON.stringify(foundUser)}`);

    return foundUser;
  }
}
