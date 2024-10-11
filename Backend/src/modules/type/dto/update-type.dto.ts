import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeDto } from './create-type.dto';
import { IsIn, IsNotEmpty, IsString, Length } from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class UpdateTypeDto extends PartialType(CreateTypeDto) {
  @IsString()
  @Length(1, 100)
  mTypeName: string;

  @IsString()
  mDescription: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;

  @IsString()
  mModified: string;
}
