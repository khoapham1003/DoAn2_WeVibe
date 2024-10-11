import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDetailDto } from './create-order_detail.dto';
import { IsDecimal, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ORDER_STATUS } from 'src/shared/constants/order-status.const';

export class UpdateOrderDetailDto extends PartialType(CreateOrderDetailDto) {
  @IsOptional()
  @IsInt()
  mOrderId?: number;

  @IsOptional()
  @IsInt()
  mProductId?: number;

  @IsOptional()
  @IsInt()
  mQuantity?: number;

  @IsOptional()
  @IsDecimal({ decimal_digits: '2' })
  mPrice?: number;

  @IsOptional()
  @IsString()
  @IsIn([ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCELLED])
  mStatus?: string;

  @IsOptional()
  @IsString()
  mModified?: string;
}
