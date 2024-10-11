import { PartialType } from '@nestjs/mapped-types';
import { CreateCartItemDto } from './create-cart-item.dto';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class UpdateCartItemDto extends PartialType(CreateCartItemDto) {
  @IsOptional()
  @IsNumber()
  mCartId?: number;

  @IsOptional()
  @IsNumber()
  mProductId?: number;

  @IsOptional()
  @IsNumber()
  mQuantity?: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;

  @IsOptional()
  @IsString()
  mModified?: string;
}
