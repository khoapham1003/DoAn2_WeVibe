import { IsString, IsNotEmpty, Length, IsNumber } from 'class-validator';

export class CreateCurrencyDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currencyCode: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  currencyName: string;

  @IsNumber()
  @IsNotEmpty()
  exchangeRate: number;
}
