import { IsInt, IsOptional } from 'class-validator';

export class UpdateProductVariantDto {
  @IsInt()
  @IsOptional()
  productId?: number;

  @IsInt()
  @IsOptional()
  sizeId?: number;

  @IsInt()
  @IsOptional()
  colorId?: number;

  @IsInt()
  @IsOptional()
  quantity?: number;
}
