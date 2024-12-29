import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductVariantDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  sizeId: number;

  @IsInt()
  @IsNotEmpty()
  colorId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;
}