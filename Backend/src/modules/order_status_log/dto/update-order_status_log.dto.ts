import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderStatusLogDto } from './create-order_status_log.dto';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class UpdateOrderStatusLogDto extends PartialType(
  CreateOrderStatusLogDto,
) {
  @IsOptional()
  @IsInt()
  mOrderId?: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;

  @IsOptional()
  @IsString()
  mComments?: string;

  @IsOptional()
  @IsString()
  mModified?: string;
}
