import { IsDecimal, IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ORDER_STATUS } from 'src/shared/constants/order-status.const';

export class CreateOrderDetailDto {
  @IsNotEmpty()
  @IsInt()
  mOrderId: number;

  @IsNotEmpty()
  @IsInt()
  mProductId: number;

  @IsNotEmpty()
  @IsInt()
  mQuantity: number;

  @IsNotEmpty()
  @IsDecimal({ decimal_digits: '2' })
  mPrice: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([ORDER_STATUS.PENDING, ORDER_STATUS.COMPLETE, ORDER_STATUS.CANCELLED])
  mStatus: string;
}
