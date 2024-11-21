import { IsNotEmpty, IsInt, IsString, IsPositive, IsOptional, IsNumber } from 'class-validator';

export class CreateWalletDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @IsInt()
  @IsNotEmpty()
  currencyId: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  balance?: number;
}
