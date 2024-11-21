import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class UpdateSizeDto {
  @IsString()
  @IsOptional()
  @Length(1, 100)
  name?: string;

  @IsInt()
  @IsOptional()
  @Min(1)
  size?: number;
}
