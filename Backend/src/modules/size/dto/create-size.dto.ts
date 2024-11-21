import { IsInt, IsNotEmpty, IsString, Length, Min } from 'class-validator';

export class CreateSizeDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @IsInt()
  @Min(1)
  size: number;
}
