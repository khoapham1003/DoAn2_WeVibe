import { IsInt, IsOptional } from 'class-validator';

export class UpdateCategoryProductDto {
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsInt()
  @IsOptional()
  productId?: number;
}
