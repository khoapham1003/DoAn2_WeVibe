import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { Cart } from '../entities/cart.entity';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/create-cart')
  async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return await this.cartService.create(createCartDto);
  }

  @Get('/get-all-cart')
  async findAll(): Promise<Cart[]> {
    return await this.cartService.findAll();
  }

  @Get('/find-cart/:mCartId')
  async findOne(@Param('mCartId') mCartId: number): Promise<Cart | null> {
    const cart = this.cartService.findOne(Number(mCartId));
    if (!cart) {
      throw new HttpException('Cart not found', HttpStatus.NOT_FOUND);
    }
    return cart;
  }

  @Patch('/update-cart/:mCartId')
  async update(
    @Param('mCartId') mCartId: number,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<void> {
    return await this.cartService.update(Number(mCartId), updateCartDto);
  }

  @Delete('/delete-cart/:mCartId')
  async remove(@Param('mCartId') mCartId: number): Promise<void> {
    return await this.cartService.remove(mCartId);
  }
}
