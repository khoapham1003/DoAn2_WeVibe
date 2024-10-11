import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { CartService } from 'src/modules/cart/service/cart.service';
import { CreateCartDto } from 'src/modules/cart/dto/create-cart.dto';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly cartService: CartService,
  ) {}

  @Post('/create-user')
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    const user = await this.userService.create(createUserDto);
    const cart = new CreateCartDto();
    cart.mUserId = user.mUserId;
    cart.mStatus = user.mStatus;
    await this.cartService.create(cart);
    return user;
  }

  @Get('/get-all-user')
  async findAll(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get('/find-user/:mUserId')
  async findOne(@Param('mUserId') mUserId: number): Promise<User | null> {
    const user = await this.userService.find(Number(mUserId));
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
