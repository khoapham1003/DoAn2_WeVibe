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
import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create-product')
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productService.create(createProductDto);
  }

  @Get('/get-all-product')
  async findAll(): Promise<Product[]> {
    return await this.productService.findAll();
  }

  @Get('/find-product/:mProductId')
  async findOne(
    @Param('mProductId') mProductId: number,
  ): Promise<Product | null> {
    const product = await this.productService.findOne(Number(mProductId));
    if (!product) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
    return product;
  }

  // @Get('/get-product-of-type/:mTypeName')
  // async findTypeProduct(
  //   @Param('mTypeName') mTypeName: string,
  // ): Promise<Product[]> {
  //   let typeName = 'Wevibe';
  //   if (mTypeName == 'do-choi') typeName = 'Đồ Chơi';
  //   else if (mTypeName == 'long') typeName = 'Lồng';
  //   else if (mTypeName == 'thuc-an') typeName = 'Thức Ăn';
  //   return await this.productService.findAllType(typeName);
  // }

  @Patch('/update-product/:mProductId')
  async update(
    @Param('mProductId') mProductId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(
      Number(mProductId),
      updateProductDto,
    );
  }

  @Delete('/delete-product/:mProductId')
  async remove(@Param('mProductId') mProductId: string) {
    return await this.productService.remove(Number(mProductId));
  }
}
