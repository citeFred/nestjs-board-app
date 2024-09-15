import { ProfilePictureType } from "../entities/profile-picture-type.enum";
import { ProfilePicture } from "../entities/profile-picture.entity";

export class ProfilePictureResponseDto {
    id: number;
    filename: string;
    mimetype: string;
    path: string;
    size: number;
    profilePictureType: ProfilePictureType;
    url: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(file: ProfilePicture){
        this.id = file.id;
        this.filename = file.filename;
        this.mimetype = file.mimetype;
        this.path = file.path;
        this.size = file.size;
        this.profilePictureType = file.profilePictureType;
        this.url = file.url;
        this.createdAt = file.createdAt;
        this.updatedAt = file.updatedAt;
    }
}