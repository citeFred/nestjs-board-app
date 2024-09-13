import { Injectable } from '@nestjs/common';
import { FileService } from './file.service';
import { UserService } from 'src/user/user.service';
import { FileType } from './entities/file-type.enum';
import { File } from './entities/file.entity';

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
        const newFile = await this.createFileMetadata(result, id);

        // 파일 엔터티를 데이터베이스에 저장
        await this.fileService.save(newFile);

        return result;
    }


    // 파일 메타데이터 생성 메서드
    private async createFileMetadata(result: any, userId: number): Promise<File> {
        const newFile = new File();
        newFile.path = result.filePath;
        newFile.filename = result.filename;
        newFile.mimetype = result.mimetype;
        newFile.size = result.size;
        newFile.fileType = FileType.PROFILE;
        newFile.user = await this.userService.findOneById(userId);
        return newFile;
    }
}
