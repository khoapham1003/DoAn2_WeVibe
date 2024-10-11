import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  mName: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mPassword: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mComfirmPassword: string;

  @IsEmail()
  @IsNotEmpty()
  mEmail: string;

  @IsBoolean()
  @IsOptional()
  mGender: boolean;

  @IsString()
  @IsOptional()
  mAddress: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  mPhone: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string;
}
