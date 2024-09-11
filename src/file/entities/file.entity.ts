import { Article } from "src/article/article.entity";
import { BaseEntity } from "src/common/base.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne } from "typeorm";

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

    @ManyToOne(() => User, user => user.files, { eager: true })
    user: User;
  
    @ManyToOne(() => Article, article => article.files, { eager: true })
    article: Article;
}
