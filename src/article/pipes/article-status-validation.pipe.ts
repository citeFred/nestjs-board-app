import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ArticleStatus } from '../entities/article-status.enum';

@Injectable()
export class ArticleStatusValidationPipe implements PipeTransform {
    private readonly statusOptions = [
        ArticleStatus.PRIVATE,
        ArticleStatus.PUBLIC
    ]

    transform(value: any, metadata: ArgumentMetadata) {
        // 메타데이터는 필수는 아니지만 type 속성을 사용하여 파라미터 타입 확인 가능.
        console.log('Parameter type:', metadata.type);

        const status = this.normalizeValue(value); // 입력값 대문자, 문자열string 변환
        if (!this.isStatusValid(status)) { // true가 !아니면 (==false면) 예외 처리
            throw new BadRequestException(`${value} is not a valid status. Allowed values are: ${this.statusOptions.join(', ')}`);
        }
        return status;
    }

    private normalizeValue(value: any): string {
        return value.toUpperCase();
    }

    private isStatusValid(status: string): boolean {
        return this.statusOptions.includes(status as ArticleStatus);
    }
}