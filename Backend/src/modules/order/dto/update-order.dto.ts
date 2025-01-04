import {
  IsString,
  IsOptional,
  IsInt,
  IsPositive,
  IsEmail,
  IsNumber,
  IsNotEmpty,
} from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  @IsOptional()
  session?: string;

  @IsString()
  @IsOptional()
  token?: string;

  @IsString()
  @IsNotEmpty()
  status?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  subTotal?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  totalDiscount?: number;

  @IsNumber()
  @IsNotEmpty()
  shippingFee?: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  grandTotal?: number;

  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsString()
  @IsNotEmpty()
  middleName?: string;

  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber?: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  line1?: string;

  @IsString()
  line2?: string;

  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsString()
  @IsNotEmpty()
  province?: string;

  @IsString()
  @IsNotEmpty()
  country?: string;
}
