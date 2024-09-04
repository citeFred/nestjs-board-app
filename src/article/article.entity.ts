import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/user/user.entity";
import { BaseEntity } from "src/common/base.entity";

@Entity()
export class Article extends BaseEntity { 
    @Column()
    author: string;

    @Column()
    title: string;

    @Column()
    contents: string;
    
    @Column()
    status: ArticleStatus;

    @ManyToOne(Type => User, user => user.articles, { eager: true })
    user: User;
}