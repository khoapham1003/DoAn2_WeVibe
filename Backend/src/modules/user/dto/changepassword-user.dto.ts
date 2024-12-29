import { IsString, IsEmail, IsOptional, IsBoolean, Length, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    oldPassword?: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    password?: string;
  
    @IsNotEmpty()
    @IsString()
    @Length(1, 255) 
    confirmPassword?: string;
}