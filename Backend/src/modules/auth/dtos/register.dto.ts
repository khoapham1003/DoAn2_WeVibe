import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  firstName: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  middleName?: string;

  @IsString()
  @IsOptional()
  @Length(1, 50)
  lastName: string;

  @IsOptional()
  phoneNumber?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  confirmPassword: string;

  @IsBoolean()
  @IsOptional()
  admin?: boolean = false;

  @IsBoolean()
  @IsOptional()
  guest?: boolean = false;
}
