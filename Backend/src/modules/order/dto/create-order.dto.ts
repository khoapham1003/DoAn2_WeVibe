import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsPositive,
    IsEmail,
    IsNumber,
  } from 'class-validator';
  
  export class CreateOrderDto {
    
    @IsString()
    @IsOptional()
    status: string;
  
    @IsNumber()
    @IsOptional()
    subTotal: number;
  
    @IsNumber()
    @IsOptional()
    totalDiscount?: number;
  }
  