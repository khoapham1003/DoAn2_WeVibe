import { IsInt, IsNotEmpty, IsPositive, IsOptional, IsNumber } from 'class-validator';

export class CreateCartItemDto {
  @IsInt()
  @IsNotEmpty()
  productVID: number;

  @IsInt()
  @IsNotEmpty()
  cartID: number;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  quantity: number;

  @IsOptional()
  active?: boolean; // Mặc định là true nếu không có
}
