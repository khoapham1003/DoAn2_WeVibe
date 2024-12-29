import { IsInt, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @IsNotEmpty()
  productVID: number;

  @IsInt()
  @IsNotEmpty()
  orderID: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  discount: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  quantity: number;
}
