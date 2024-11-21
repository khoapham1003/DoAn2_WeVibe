import { IsInt, IsOptional, IsPositive, IsNumber } from 'class-validator';

export class UpdateCartItemDto {
  @IsInt()
  @IsOptional()
  productVID?: number;

  @IsInt()
  @IsOptional()
  cartID?: number;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsInt()
  @IsOptional()
  @IsPositive()
  quantity?: number;

  @IsOptional()
  active?: boolean;
}
