import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CartItemService } from '../service/cart-item.service';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartItem } from '../entities/cart-item.entity';

@Controller('cart-item')
export class CartItemController {
  constructor(private readonly cartItemService: CartItemService) {}

  @Post('/create-cart-item')
  async create(
    @Body() createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    return await this.cartItemService.create(createCartItemDto);
  }

  @Get('/find-add-cart-item')
  async findAll(): Promise<CartItem[]> {
    return await this.cartItemService.findAll();
  }

  @Get('/find-cart-item/:mCartItem')
  async findOne(
    @Param('mCartItem') mCartItem: number,
  ): Promise<CartItem | null> {
    return await this.cartItemService.findOne(Number(mCartItem));
  }

  @Get('/get-item-of-cart/:mCartId')
  async GetItemOfCart(
    @Param('mCartId') mCartId: number,
  ): Promise<CartItem[] | null> {
    return await this.cartItemService.getItemOfCart(Number(mCartId));
  }

  @Patch('/update-cart-item/:mCartItem')
  async update(
    @Param('mCartItem') mCartItem: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ): Promise<void> {
    return await this.cartItemService.update(
      Number(mCartItem),
      updateCartItemDto,
    );
  }

  @Delete('/delete-cart-item/:mCartItem')
  async remove(@Param('mCartItem') mCartItem: number) {
    return await this.cartItemService.remove(Number(mCartItem));
  }
}
