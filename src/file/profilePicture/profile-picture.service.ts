import { Injectable } from '@nestjs/common';
import { ProfilePictureUploadService } from './profile-picture-upload.service';
import { UserService } from 'src/user/user.service';
import { ProfilePictureType } from './entities/profile-pictures-type.enum';
import { ProfilePicture } from './entities/profile-picture.entity';

@Injectable()
export class ProfilePictureService {
    constructor(
        private readonly profilePictureUploadService: ProfilePictureUploadService,
        private readonly userService: UserService,
    ) {}

    // 회원 가입 프로필 사진 업로드
    async uploadProfilePicture(file: Express.Multer.File, id: number) {
        // 파일 업로드
        const result = await this.profilePictureUploadService.uploadProfilePicture(file);

        // 파일 메타데이터 저장
        const newFile = await this.createFileMetadata(result, id);

        // 파일 엔터티를 데이터베이스에 저장
        await this.profilePictureUploadService.save(newFile);

        return result;
    }

    // 파일 메타데이터 생성 메서드
    private async createFileMetadata(result: any, userId: number): Promise<ProfilePicture> {
        const newFile = new ProfilePicture();
        newFile.path = result.filePath;
        newFile.filename = result.filename;
        newFile.mimetype = result.mimetype;
        newFile.size = result.size;
        newFile.profilePictureType = ProfilePictureType.IMAGE;
        newFile.url = result.url;
        newFile.user = await this.userService.findOneById(userId);
        return newFile;
    }
}
