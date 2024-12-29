import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsPositive,
    IsEmail,
    IsNumber,
  } from 'class-validator';
  
  export class ConfirmOrderDto {
    
    @IsString()
    @IsOptional()
    status: string;
  }
  