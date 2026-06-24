import { IsOptional, IsInt, IsString, IsBoolean, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class QueryBookDto{
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    page: number = 1;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(100)
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    author?: string;

    @IsOptional()
    @IsBoolean()
    @Transform(({value}) => value === 'true' || value === 1 || value === '1')
    published?: boolean;
}