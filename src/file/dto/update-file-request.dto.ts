import { PartialType } from '@nestjs/mapped-types';
import { CreateFileDto } from './create-file-request.dto';

export class UpdateFileDto extends PartialType(CreateFileDto) {}
