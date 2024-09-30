import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ArticleStatus } from "./article-status.enum";
import { User } from "src/user/entities/user.entity";
import { BaseEntity } from "src/common/base.entity";
import { Attachment } from "src/file/attachment/entities/attachment.entity";

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

    @ManyToOne(() => User, user => user.articles, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Attachment, attachment => attachment.article, { eager: true })
    attachments: Attachment[];
}