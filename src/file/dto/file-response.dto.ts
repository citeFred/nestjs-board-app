
import { FileType } from "../entities/file-type.enum";
import { File } from "../entities/file.entity";

export class FileResponseDto {
    id: number;
    filename: string;
    mimetype: string;
    path: string;
    size: number;
    fileType: FileType;
    createdAt: Date;
    updatedAt: Date;

    constructor(file: File){
        this.id = file.id;
        this.filename = file.filename;
        this.mimetype = file.mimetype;
        this.path = file.path;
        this.size = file.size;
        this.fileType = file.fileType;
        this.createdAt = file.createdAt;
        this.updatedAt = file.updatedAt;
    }
}