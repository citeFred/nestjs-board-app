import { UserRole } from "src/user/user-role.enum";
import { User } from "src/user/user.entity";

export class UserResponseDto {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
    postalCode: string;
    address: string;
    detailAddress: string;

    constructor(user: User){
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
        this.postalCode = user.postalCode;
        this.address = user.address;
        this.detailAddress = user.detailAddress;
    }
}