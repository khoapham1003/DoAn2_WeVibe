import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, Min, MaxLength } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  @MaxLength(255)
  title?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  slug?: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  quantity?: number;

  @IsBoolean()
  @IsOptional()
  shop?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @IsDateString()
  @IsOptional()
  startsAt?: Date;

  @IsDateString()
  @IsOptional()
  endsAt?: Date;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  picture?: string;
}
