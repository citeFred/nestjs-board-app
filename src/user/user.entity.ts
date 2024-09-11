import { Column, Entity, OneToMany } from "typeorm";
import { Article } from "src/article/article.entity";
import { UserRole } from "./user-role.enum";
import { BaseEntity } from "src/common/base.entity";
import { File } from "src/file/entities/file.entity";

@Entity()
export class User extends BaseEntity{
    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true })
    postalCode: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    detailAddress: string;

    @OneToMany(() => Article, article => article.author, { eager: false })
    articles: Article[];

    @OneToMany(() => File, file => file.user, { eager: false })
    files: File[];
}