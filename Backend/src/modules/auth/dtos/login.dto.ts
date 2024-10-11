import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class LoginDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(6, 100)
  mPassword: string;

  @IsString()
  @IsNotEmpty()
  mName: string;
}
