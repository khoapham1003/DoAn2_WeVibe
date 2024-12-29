import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsDateString, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsBoolean()
  shop: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @IsDateString()
  startsAt: Date;

  @IsDateString()
  endsAt: Date;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  picture?: string;
}
