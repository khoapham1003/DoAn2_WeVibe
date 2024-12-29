import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateProductVariantDto } from '../dto/create-productvariant.dto';
import { ProductVariantService } from '../service/productvariant.service';
import { UpdateProductVariantDto } from '../dto/update-productvariant.dto';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { RolesGuard } from 'src/Common/Gard/role.gard';

@Controller('product-variants')
@UseGuards(RolesGuard)
export class ProductVariantController {
  constructor(private readonly productVariantService: ProductVariantService) {}

  @Post('/create-productvariant')
  @Roles('admin')
  create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantService.create(createProductVariantDto);
  }
  @Get('/get-by-productId/:productId')
  async getProductVariantsByProductId(@Param('productId') productId: number) {
    return await this.productVariantService.getProductVariantsByProductId(productId);
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
  @Roles('admin')
  update(@Param('id') id: number, @Body() updateProductVariantDto: UpdateProductVariantDto) {
    return this.productVariantService.update(id, updateProductVariantDto);
  }

  @Delete('/delete-productvariant/:id')
  @Roles('admin')
  remove(@Param('id') id: number) {
    return this.productVariantService.remove(id);
  }
}
