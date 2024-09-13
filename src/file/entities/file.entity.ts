import { Article } from "src/article/article.entity";
import { BaseEntity } from "src/common/base.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { FileType } from "./file-type.enum";

@Entity()
export class File extends BaseEntity {
    @Column()
    filename: string;
  
    @Column()
    mimetype: string;
  
    @Column()
    path: string;
  
    @Column()
    size: number;

    @Column()
    fileType: FileType;

    @Column()
    url: string;

    @ManyToOne(() => User, user => user.files, { eager: false })
    user: User;
  
    @ManyToOne(() => Article, article => article.files, { eager: false })
    article: Article;
}
