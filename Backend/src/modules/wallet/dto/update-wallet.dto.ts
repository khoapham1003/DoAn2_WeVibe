import { IsInt, IsString, IsOptional, IsNumber, IsPositive } from 'class-validator';

export class UpdateWalletDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsString()
  @IsOptional()
  walletAddress?: string;

  @IsInt()
  @IsOptional()
  currencyId?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  balance?: number;
}
