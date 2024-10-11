import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class CreateCartDto {
  @IsNotEmpty()
  @IsInt()
  mUserId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;
}
