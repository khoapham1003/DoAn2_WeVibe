import {
  IsString,
  IsNumber,
  Length,
  MaxLength,
  IsNotEmpty,
  IsIn,
  IsInt,
} from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class CreateProductDto {
  @IsString()
  @Length(1, 100)
  mProductName: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  mProductPrice: number;

  @IsString()
  mProductDescription: string;

  @IsNumber()
  mProductStockQuantity: number;

  @IsString()
  @MaxLength(200)
  mProductImage: string;

  @IsInt()
  mTypeId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;
}
