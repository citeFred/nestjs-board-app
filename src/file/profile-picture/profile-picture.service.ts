import { Injectable } from '@nestjs/common';
import { ProfilePictureUploadService } from './profile-picture-upload.service';
import { ProfilePictureType } from './entities/profile-picture-type.enum';
import { ProfilePicture } from './entities/profile-picture.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProfilePictureService {
    constructor(private readonly profilePictureUploadService: ProfilePictureUploadService) {}

    // 회원 가입 프로필 사진 업로드
    async uploadProfilePicture(file: Express.Multer.File, user: User) {
        // 파일 업로드
        const result = await this.profilePictureUploadService.uploadProfilePicture(file);

        // 파일 메타데이터 저장
        const newFile = await this.createFileMetadata(result, user);

        // 파일 엔터티를 데이터베이스에 저장
        await this.profilePictureUploadService.save(newFile);

        return result;
    }

    // 파일 메타데이터 생성 메서드
    private async createFileMetadata(result: any, user: User): Promise<ProfilePicture> {
        const newFile = new ProfilePicture();
        newFile.path = result.filePath;
        newFile.filename = result.filename;
        newFile.mimetype = result.mimetype;
        newFile.size = result.size;
        newFile.profilePictureType = ProfilePictureType.IMAGE;
        newFile.url = result.url;
        newFile.user = user;
        return newFile;
    }
}
