import { IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDto {
    @IsOptional()
    @IsString()
    postalCode?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    detailAddress?: string;
}