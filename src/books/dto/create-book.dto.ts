import {IsString, IsBoolean, IsOptional, MinLength} from 'class-validator';

export class CreateBookDto{
    @IsString()
    @MinLength(1)
    title: string;

    @IsString()
    @MinLength(1)
    author: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsBoolean()
    @IsOptional()
    published?: boolean;
}