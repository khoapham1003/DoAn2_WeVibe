import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CreateProductVariantDto } from '../dto/create-productvariant.dto';
import { ProductVariantService } from '../service/productvariant.service';
import { UpdateProductVariantDto } from '../dto/update-productvariant.dto';

@Controller('product-variants')
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post('/create-productvariant')
  create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantService.create(createProductVariantDto);
  }

  @Get('/get-by-ids/:productId/:sizeId/:colorId')
  async getProductVariantId(
    @Param('productId') productId: number,
    @Param('sizeId') sizeId: number,
    @Param('colorId') colorId: number,
  ) {
    return await this.productVariantService.getProductVariantId(productId, sizeId, colorId);
  }

  @Get('/get-all-productvariants')
  findAll() {
    return this.productVariantService.findAll();
  }

  @Get('/find-productvariant/:id')
  findOne(@Param('id') id: number) {
    return this.productVariantService.findOne(id);
  }

  @Patch('/update-productvariant/:id')
  update(@Param('id') id: number, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Delete('/delete-productvariant/:id')
  remove(@Param('id') id: number) {
    return this.productVariantService.remove(id);
  }
}
