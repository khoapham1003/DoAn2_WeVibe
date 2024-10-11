import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  @IsNotEmpty()
  @IsInt()
  mUserId: number;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;

  @IsOptional()
  @IsDateString()
  mModified?: string;
}
