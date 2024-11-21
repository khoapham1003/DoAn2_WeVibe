import { IsString, IsNotEmpty, IsInt, IsOptional, Length } from 'class-validator';

export class CreateCartDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  status?: string;
}
