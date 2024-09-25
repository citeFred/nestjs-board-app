import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { ProfilePictureService } from 'src/file/profile-picture/profile-picture.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private profilePictureService: ProfilePictureService
  ) {}

  async findOneById(id: number): Promise<User> {
    return this.userRepository.findOneBy({id});
  }

  // 회원정보+파일 정보 조회
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

  // 회원정보 수정
  async updateUser(id: number, updateUserRequestDto: UpdateUserRequestDto, logginedUser: User, file?: Express.Multer.File): Promise<User> {
    this.logger.verbose(`Attempting to update User with ID ${id}`);

    const foundUser = await this.getUserByIdWithProfile(id);

    if (foundUser.id !== logginedUser.id) {
      this.logger.warn(`User ${logginedUser.username} attempted to update User details ${id} without permission`);
      throw new UnauthorizedException(`You do not have permission to update this User`);
    }

    Object.assign(foundUser, updateUserRequestDto)

    if (file) {
        await this.profilePictureService.uploadProfilePicture(file, foundUser);
    }

    const updatedUser = await this.userRepository.save(foundUser);

    this.logger.verbose(`User with ID ${id} updated successfully: ${JSON.stringify(updatedUser)}`);
    return updatedUser;
  }

  // 회원 탈퇴
  async deleteUserById(id: number, logginedUser: User): Promise<void> {
    this.logger.verbose(`User ${logginedUser.username} is attempting to delete User with ID ${id}`);
    const foundUser = await this.findOneById(id);
    if (foundUser.id !== logginedUser.id) {
        this.logger.warn(`User ${logginedUser.username} attempted to delete User ID ${id} without permission`);
        throw new UnauthorizedException(`You do not have permission to delete this User`);
    }
    await this.userRepository.remove(foundUser);
    this.logger.verbose(`User with ID ${id} deleted by User ${logginedUser.username}`);
  }
}
