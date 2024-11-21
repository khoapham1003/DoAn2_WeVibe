import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { CartService } from '../service/cart.service';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { Cart } from '../entities/cart.entity'; // Import entity nếu cần thiết

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/create-cart')
  async create(@Body() createCartDto: CreateCartDto): Promise<Cart> {
    return this.cartService.create(createCartDto);
  }

  @Get('/get-all-carts')
  async findAll(): Promise<Cart[]> {
    return this.cartService.findAll();
  }

  @Get('/find-cart/:id')
  async findOne(@Param('id') id: string): Promise<Cart> {
    const cart = await this.cartService.findOne(+id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }
  @Get('/find-cart-by-userid/:id')
  async findbyUserId(@Param('id') id: string): Promise<Cart> {
    const cart = await this.cartService.findbyUserId(+id);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return cart;
  }
  @Patch('/update-cart/:id')
  async update(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
  ): Promise<Cart> {
    const updatedCart = await this.cartService.update(+id, updateCartDto);
    if (!updatedCart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }
    return updatedCart;
  }

}
