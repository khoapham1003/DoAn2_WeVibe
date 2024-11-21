import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategoryProductService } from '../service/categoryproduct.service';
import { CreateCategoryProductDto } from '../dto/create-categoryproduct.dto';
import { UpdateCategoryProductDto } from '../dto/update-categoryproduct.dto';

@Controller('category-product')
export class CategoryProductController {
  constructor(private readonly categoryProductService: CategoryProductService) {}

  @Post('/create')
  async create(@Body() createCategoryProductDto: CreateCategoryProductDto) {
    return await this.categoryProductService.create(createCategoryProductDto);
  }

  @Get('/all')
  async findAll() {
    return await this.categoryProductService.findAll();
  }

  @Get('/find/:id')
  async findOne(@Param('id') id: number) {
    return await this.categoryProductService.findOne(id);
  }

  @Patch('/update/:id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryProductDto: UpdateCategoryProductDto,
  ) {
    return await this.categoryProductService.update(id, updateCategoryProductDto);
  }

  @Delete('/delete/:id')
  async remove(@Param('id') id: number) {
    return await this.categoryProductService.remove(id);
  }
}
