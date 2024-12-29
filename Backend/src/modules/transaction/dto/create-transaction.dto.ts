import { IsInt, IsNotEmpty, IsString, Length, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  orderId: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  paymentMethodType: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  status: string;

  @IsString()
  @IsOptional()
  paymentDetails: string;
}
