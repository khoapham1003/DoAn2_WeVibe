import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CategoryProductService } from '../service/categoryproduct.service';
import { CreateCategoryProductDto } from '../dto/create-categoryproduct.dto';
import { UpdateCategoryProductDto } from '../dto/update-categoryproduct.dto';
import { RolesGuard } from 'src/Common/Gard/role.gard';
import { Roles } from 'src/Common/decorators/roles.decorator';

@Controller('category-product')
@UseGuards(RolesGuard)
export class CategoryProductController {
  constructor(private readonly categoryProductService: CategoryProductService) {}

  @Post('/create')
  @Roles('admin')
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
  @Roles('admin')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryProductDto: UpdateCategoryProductDto,
  ) {
    return await this.categoryProductService.update(id, updateCategoryProductDto);
  }

  @Delete('/delete/:id')
  @Roles('admin')
  async remove(@Param('id') id: number) {
    return await this.categoryProductService.remove(id);
  }
}
