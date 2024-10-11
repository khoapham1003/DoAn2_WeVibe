import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  IsNotEmpty,
  IsIn,
  IsBoolean,
} from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
  @IsBoolean()
  @IsNotEmpty()
  mGender?: boolean;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mAddress?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mPassword?: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;

  @IsString()
  mModified: string;
}
