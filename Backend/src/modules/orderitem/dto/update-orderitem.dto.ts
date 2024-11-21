import { IsInt, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateOrderItemDto {
  @IsInt()
  @IsOptional()
  productVID?: number;

  @IsInt()
  @IsOptional()
  orderID?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsNumber()
  @IsOptional()
  discount?: number;

  @IsInt()
  @IsPositive()
  @IsOptional()
  quantity?: number;
}
