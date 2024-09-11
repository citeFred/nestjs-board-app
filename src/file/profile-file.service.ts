// profile-file.service.ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { UserService } from 'src/user/user.service';
import { FileType } from './entities/file-type.enum';
import { File } from './entities/file.entity';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

@Injectable()
export class ProfileService {
    constructor(
        private readonly fileService: FileService,
        private readonly userService: UserService,
    ) {}

    // 회원 가입 프로필 사진 업로드
    async uploadProfilePicture(file: Express.Multer.File, id: number) {
        // 파일 업로드
        const result = await this.fileService.uploadFile(file);

        // 파일 메타데이터 저장
        const newFile = new File();
        newFile.path = result.filePath;
        newFile.filename = result.filename;
        newFile.mimetype = result.mimetype;
        newFile.size = result.size;
        newFile.fileType = FileType.PROFILE;
        newFile.user = await this.userService.findOneById(id);

        // 파일 엔터티를 데이터베이스에 저장
        await this.fileService.save(newFile);

        return result;
    }

    // 기본 프로필 처리(회원가입 사진 미업로드)
    async uploadDefaultProfilePicture(id: number) {
        // 파일 업로드
        const result = await this.fileService.uploadDefaultProfilePictureFile();

        // 파일 메타데이터 저장
        const newFile = new File();
        newFile.path = result.filePath;
        newFile.filename = result.filename;
        newFile.mimetype = result.mimetype;
        newFile.size = result.size;
        newFile.fileType = FileType.PROFILE;
        newFile.user = await this.userService.findOneById(id);

        // 파일 엔터티를 데이터베이스에 저장
        await this.fileService.save(newFile);

        return result;
    }
}
