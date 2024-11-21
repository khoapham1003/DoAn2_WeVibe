import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { SizeService } from '../service/size.service';
import { CreateSizeDto } from '../dto/create-size.dto';
import { UpdateSizeDto } from '../dto/update-size.dto';

@Controller('sizes')
export class SizeController {
  constructor(private readonly sizeService: SizeService) {}

  @Post('/create-size')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSizeDto: CreateSizeDto) {
    return await this.sizeService.create(createSizeDto);
  }

  @Get('/get-all-sizes')
  async findAll() {
    return await this.sizeService.findAll();
  }

  @Get('/find-size/:id')
  async findOne(@Param('id') id: string) {
    return await this.sizeService.findOne(+id);
  }

  @Patch('/update-size/:id')
  async update(@Param('id') id: string, @Body() updateSizeDto: UpdateSizeDto) {
    return await this.sizeService.update(+id, updateSizeDto);
  }

  @Delete('/delete-size/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return await this.sizeService.remove(+id);
  }
}
