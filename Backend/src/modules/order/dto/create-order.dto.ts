import { IsDecimal, IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ORDER_STATUS } from 'src/shared/constants/order-status.const';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  mUserId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCELLED])
  mStatus: string;

  @IsDecimal()
  @IsNotEmpty()
  mTotalAmount: number;

  @IsString()
  @IsNotEmpty()
  mPaymentMethod: string;
}
