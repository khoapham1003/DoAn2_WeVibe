import { IsString, IsOptional, Length, IsNumber } from 'class-validator';

export class UpdateCurrencyDto {
  @IsString()
  @IsOptional()
  @Length(3, 3)
  currencyCode?: string;

  @IsString()
  @IsOptional()
  @Length(1, 100)
  currencyName?: string;

  @IsNumber()
  @IsOptional()
  exchangeRate?: number;
}
