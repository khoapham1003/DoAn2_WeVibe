import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ForgotPasswordDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  Password: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255) 
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  Email: string;
}
