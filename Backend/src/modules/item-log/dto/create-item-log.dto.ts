import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class CreateItemLogDto {
  @IsNotEmpty()
  @IsNumber()
  mProductId: number;

  @IsNotEmpty()
  @IsString()
  mChangeDescription: string;

  @IsNotEmpty()
  @IsNumber()
  mQuantity: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;
}
