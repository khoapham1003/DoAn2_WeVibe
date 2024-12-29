import { IsString, IsOptional, IsHexColor } from 'class-validator';

export class UpdateColorDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsHexColor()
  @IsOptional()
  hex?: string;
}
