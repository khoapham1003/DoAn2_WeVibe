import { TYPE_STATUS } from 'src/shared/constants/status.const';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  mName: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  mEmail: string;

  @IsString()
  @IsOptional()
  @Length(10, 20)
  mPhone: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mPassword: string;

  @IsString()
  @IsNotEmpty()
  @IsIn([TYPE_STATUS.ACTIVE, TYPE_STATUS.DELETE])
  mStatus: string = TYPE_STATUS.ACTIVE;
}
