import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { ProfilePictureModule } from 'src/file/profile-picture/profile-picture.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        ProfilePictureModule,
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController]
})
export class UserModule {}
