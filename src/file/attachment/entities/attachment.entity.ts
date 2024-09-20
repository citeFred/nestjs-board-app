import { BaseEntity } from "src/common/base.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Article } from "src/article/entities/article.entity";
import { AttachmentType } from "./attachment-type.enum";

@Entity()
export class Attachment extends BaseEntity {
    @Column()
    filename: string;
  
    @Column()
    mimetype: string;
  
    @Column()
    path: string;
  
    @Column()
    size: number;

    @Column()
    attachmentType: AttachmentType;

    @Column()
    url: string;

    @ManyToOne(() => Article, article => article.attachments, { eager: false, onDelete: 'CASCADE' })
    article: Article;
}