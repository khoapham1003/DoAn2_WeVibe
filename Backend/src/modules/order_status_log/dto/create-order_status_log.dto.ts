import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class CreateOrderStatusLogDto {
  @IsNotEmpty()
  @IsInt()
  mOrderId: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus?: string;

  @IsOptional()
  @IsString()
  mComments?: string;
}
