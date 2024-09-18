import { ProfilePictureResponseDto } from "src/file/profile-picture/dto/profile-picture-response.dto";
import { UserRole } from "../entities/user-role.enum";
import { User } from "../entities/user.entity";

export class UserWithProfilePictureResponseDto {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    postalCode: string;
    address: string;
    detailAddress: string;
    profilePictures: ProfilePictureResponseDto[];

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.postalCode = user.postalCode;
        this.address = user.address;
        this.detailAddress = user.detailAddress;
        this.profilePictures = user.profilePictures.map(profilePicture => new ProfilePictureResponseDto(profilePicture));
    }
}
