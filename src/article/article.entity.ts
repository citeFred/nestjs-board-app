import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/user/user.entity";
import { BaseEntity } from "src/common/base.entity";
// import { File } from "src/file/entities/file.entity";

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

    @ManyToOne(() => User, user => user.articles, { eager: true })
    user: User;

    // @OneToMany(() => File, file => file.article, { eager: true })
    // files: File[];
}