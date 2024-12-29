import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserBehaviorDto {
  @IsInt()
  @IsNotEmpty()
  userId: number;

  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsString()
  @IsNotEmpty()
  interactionType: string;

  timestamp?: Date;
}
