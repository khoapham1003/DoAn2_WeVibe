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
import { TypeService } from '../service/type.service';
import { CreateTypeDto } from '../dto/create-type.dto';
import { UpdateTypeDto } from '../dto/update-type.dto';
import { Type } from '../entities/type.entity';

@Controller('type')
export class TypeController {
  constructor(private readonly typeService: TypeService) {}

  @Post('/create-type')
  async create(@Body() createTypeDto: CreateTypeDto): Promise<Type> {
    return await this.typeService.create(createTypeDto);
  }

  @Get('/get-all-type')
  async findAll(): Promise<Type[]> {
    return await this.typeService.findAll();
  }

  @Get('/find-type/:mTypeId')
  async findOne(@Param('mTypeId') mTypeId: number): Promise<Type | null> {
    const type = await this.typeService.findOne(Number(mTypeId));
    if (!type) {
      throw new HttpException('Type not found', HttpStatus.NOT_FOUND);
    }
    return type;
  }

  @Patch('/update-type/:mTypeId')
  async update(
    @Param('mTypeId') mTypeId: number,
    @Body() updateTypeDto: UpdateTypeDto,
  ): Promise<void> {
    return await this.typeService.update(Number(mTypeId), updateTypeDto);
  }

  @Delete('/delete-type/:mTypeId')
  async remove(@Param('mTypeId') mTypeId: number): Promise<void> {
    return await this.typeService.remove(mTypeId);
  }
}
