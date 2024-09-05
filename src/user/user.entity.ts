import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "src/article/article.entity";
import { UserRole } from "./user-role.enum";
import { BaseEntity } from "src/common/base.entity";

@Entity()
export class User extends BaseEntity{
    @Column()
    username: string;

    @Column()
    password: string;

    @Column({ unique: true }) // 이메일은 중복되지 않도록 한다.
    email: string;

    @Column({ default: UserRole.USER })
    role: UserRole;

    @Column({ nullable: true })
    postalCode: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    detailAddress: string;

    @OneToMany(Type => Article, article => article.author, { eager: false })
    articles: Article[];
}