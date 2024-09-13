import { FileResponseDto } from "src/file/dto/file-response.dto";
import { UserRole } from "../user-role.enum";
import { User } from "../user.entity";

export class UserWithFilesResponseDto {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    postalCode: string;
    address: string;
    detailAddress: string;
    files: FileResponseDto[];

    constructor(user: User) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.postalCode = user.postalCode;
        this.address = user.address;
        this.detailAddress = user.detailAddress;
        this.files = user.files.map(file => new FileResponseDto(file));
    }
}
