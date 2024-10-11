import { TYPE_STATUS } from 'src/shared/constants/status.const';
import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
  IsIn,
} from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mName?: string;

  @IsOptional()
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  mEmail?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  mPhone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mPassword?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus?: string;

  @IsOptional()
  @IsString()
  mModified?: string;
}
