import { IsString, IsNotEmpty, IsNumber, IsOptional, IsBoolean, IsDateString, Min, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @IsString()
  @MaxLength(255)
  slug: string;

  @IsString()
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
  startsAt: Date = new Date(); 
  
  @IsDateString()
  endsAt: Date = new Date()

  @IsString()
  @IsOptional()
  @MaxLength(255)
  picture?: string;
}
