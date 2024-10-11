import { PartialType } from '@nestjs/mapped-types';
import { CreateItemLogDto } from './create-item-log.dto';
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class UpdateItemLogDto extends PartialType(CreateItemLogDto) {
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

  @IsOptional()
  @IsDateString()
  mModified?: string;
}
