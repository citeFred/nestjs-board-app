import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile-file.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    UserModule
  ],
  providers: [FileService, ProfileService],
  exports: [FileService, ProfileService]
})
export class FileModule {}
