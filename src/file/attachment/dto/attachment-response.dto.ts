import { AttachmentType } from "../entities/attachment-type.enum";
import { Attachment } from "../entities/attachment.entity";

export class AttachmentResponseDto {
    id: number;
    filename: string;
    mimetype: string;
    size: number;
    attachmentType: AttachmentType;
    url: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(file: Attachment){
        this.id = file.id;
        this.filename = file.filename;
        this.mimetype = file.mimetype;
        this.size = file.size;
        this.attachmentType = file.attachmentType;
        this.url = file.url;
        this.createdAt = file.createdAt;
        this.updatedAt = file.updatedAt;
    }
}