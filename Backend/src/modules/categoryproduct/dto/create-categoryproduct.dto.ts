import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateCategoryProductDto {
  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;
}
