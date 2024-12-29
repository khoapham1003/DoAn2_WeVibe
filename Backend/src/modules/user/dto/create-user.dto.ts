import { IsString, IsEmail, IsOptional, IsBoolean, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 50)
  firstName: string;

  @IsOptional()
  @IsString()
  @Length(1, 50)
  middleName?: string;

  @IsString()
  @Length(1, 50)
  lastName: string;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  phoneNumber?: string;

  @IsEmail()
  @Length(1, 100)
  email: string;

  @IsString()
  @Length(1, 255)
  passwordHash: string;

  @IsOptional()
  @IsBoolean()
  admin?: boolean;

  @IsOptional()
  @IsBoolean()
  guest?: boolean;
}
