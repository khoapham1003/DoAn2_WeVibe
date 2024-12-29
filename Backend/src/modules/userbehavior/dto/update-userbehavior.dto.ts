import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateUserBehaviorDto {
  @IsInt()
  @IsOptional()
  userId?: number;

  @IsInt()
  @IsOptional()
  productId?: number;

  @IsString()
  @IsOptional()
  interactionType?: string;

  @IsOptional()
  timestamp?: Date;
}
