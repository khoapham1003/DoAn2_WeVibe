import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsDecimal,
} from 'class-validator';
import { ORDER_STATUS } from 'src/shared/constants/order-status.const';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsOptional()
  @IsInt()
  mUserId?: number;

  @IsOptional()
  @IsString()
  @IsIn([ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCELLED])
  mStatus?: string;

  @IsOptional()
  @IsDecimal()
  mTotalAmount?: number;

  @IsOptional()
  @IsString()
  mPaymentMethod?: string;

  @IsOptional()
  @IsDateString()
  mModified?: string;
}
