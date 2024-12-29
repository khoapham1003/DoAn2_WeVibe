import { IsString, IsNotEmpty, IsHexColor } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsHexColor()
  hex: string;
}
