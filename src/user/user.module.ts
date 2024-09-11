import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule {}
