import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { SearchProductDto } from '../dto/search-product.dto';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { RolesGuard } from 'src/Common/Gard/role.gard';

@Controller('product')
@UseGuards(RolesGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create-product')
  @Roles('admin')
  async create(@Body() createProductDto: CreateProductDto) {
    try {
      const product = await this.productService.create(createProductDto);
      return { statusCode: HttpStatus.CREATED, data: product };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  @Post('search-product')
  async searchProducts(@Body() searchProductDto: SearchProductDto) {
    const { keyword } = searchProductDto;

    try {
      const products = await this.productService.searchProducts(keyword);
      return { statusCode: HttpStatus.OK, data: products };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-all-products-with-categories')
  async findAllWithCategories() {
    try {
      const products = await this.productService.findAllWithCategories();
      return {
        statusCode: HttpStatus.OK,
        data: products,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('category/:categoryId')
  async getProductsByCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<Product[]> {
    return this.productService.findByCategory(categoryId);
  }
  @Get('get-all-products')
  async findAll() {
    try {
      const products = await this.productService.findAll();
      return { statusCode: HttpStatus.OK, data: products };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-all-products-admin')
  async findAllAdmin() {
    try {
      const products = await this.productService.findAllAdmin();
      return { statusCode: HttpStatus.OK, data: products };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get-product/:id')
  async findOne(@Param('id') id: string) {
    try {
      const product = await this.productService.findOne(+id);
      if (!product) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Product not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { statusCode: HttpStatus.OK, data: product };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('update-product/:id')
  @Roles('admin')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    try {
      const updatedProduct = await this.productService.update(
        +id,
        updateProductDto,
      );
      if (!updatedProduct) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Product not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { statusCode: HttpStatus.OK, data: updatedProduct };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('delete-product/:id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.productService.remove(+id);
      if (!result) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Product not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Product deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
