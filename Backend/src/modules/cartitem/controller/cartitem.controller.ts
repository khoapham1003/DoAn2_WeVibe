import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateCartItemDto } from '../dto/create-cartitem.dto';
import { CartItem } from '../entities/cartitem.entity';
import { CartItemService } from '../service/cartitem.service';
import { UpdateCartItemDto } from '../dto/update-cartitem.dto';
import { ProductVariantService } from 'src/modules/productvariant/service/productvariant.service';

@Controller('cartitem')
export class CartitemController {
  constructor(private readonly cartitemService: CartItemService,
    private readonly productVariantService: ProductVariantService,
   

  ) {}

  @Post('/create-cart-item')
  async createCartItem(@Body() createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    return await this.cartitemService.createCartItem(createCartItemDto);
  }
  @Get()
  findAll() {
    return this.cartitemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cartitemService.findOne(+id);
  }

  @Get('/get-cart-data/:id')
  findCartData(@Param('id') id: string) {
    return this.cartitemService.findCartData(+id);
  }

  @Patch('/update-cartitem/:id')
  update(@Param('id') id: string, @Body() updateCartitemDto: UpdateCartItemDto) {
    return this.cartitemService.update(+id, updateCartitemDto);
  }

  @Delete('/delete-cartitem/:id')
  remove(@Param('id') id: string) {
    return this.cartitemService.remove(+id);
  }
}
