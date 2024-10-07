import { BaseEntity } from "src/common/base.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { ProfilePictureType } from "./profile-picture-type.enum";

@Entity()
export class ProfilePicture extends BaseEntity {
    @Column()
    filename: string;
  
    @Column()
    mimetype: string;
  
    @Column()
    size: number;

    @Column()
    profilePictureType: ProfilePictureType;

    @Column()
    url: string;

    @ManyToOne(() => User, user => user.profilePictures, { eager: false, onDelete: 'CASCADE' })
    user: User;
}