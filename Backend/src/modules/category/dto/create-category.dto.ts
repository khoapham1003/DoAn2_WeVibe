import { IsString, IsOptional, IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsInt()
  @IsOptional()
  @IsPositive()
  parentId?: number;
}
