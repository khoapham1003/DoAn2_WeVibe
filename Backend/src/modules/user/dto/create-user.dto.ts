import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  mName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  mEmail: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mComfirmPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  mPhone: string;

  @IsBoolean()
  @IsNotEmpty()
  mGender: boolean;

  @IsString()
  @IsNotEmpty()
  mAddress: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;
}
