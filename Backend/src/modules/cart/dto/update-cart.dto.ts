import { IsString, IsOptional, IsInt, Length } from 'class-validator';

export class UpdateCartDto {
  @IsOptional()
  @IsInt()
  userId?: number;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  session?: string;

  @IsOptional()
  @IsString()
  @Length(1, 255)
  token?: string;

  @IsOptional()
  @IsString()
  @Length(0, 50)
  status?: string;
}
