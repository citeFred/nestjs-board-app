import { BaseEntity } from "src/common/base.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProfilePictureType } from "./profile-picture-type.enum";

@Entity()
export class ProfilePicture extends BaseEntity {
    @Column()
    filename: string;
  
    @Column()
    mimetype: string;
  
    @Column()
    path: string;
  
    @Column()
    size: number;

    @Column()
    profilePictureType: ProfilePictureType;

    @Column()
    url: string;

    @ManyToOne(() => User, user => user.profilePictures, { eager: false })
    user: User;
}