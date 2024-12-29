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
  UseGuards,
} from '@nestjs/common';
import { ColorService } from '../service/color.service';
import { CreateColorDto } from '../dto/create-color.dto';
import { UpdateColorDto } from '../dto/update-color.dto';
import { Roles } from 'src/Common/decorators/roles.decorator';
import { RolesGuard } from 'src/Common/Gard/role.gard';

@Controller('color')
@UseGuards(RolesGuard)
export class ColorController {
  
  constructor(private readonly colorService: ColorService) {}

  @Post('/create-color')
  @Roles('admin')
  async create(@Body() createColorDto: CreateColorDto) {
    try {
      const color = await this.colorService.create(createColorDto);
      return { statusCode: HttpStatus.CREATED, message: 'Color created successfully', data: color };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.BAD_REQUEST, message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get-all-colors')
  async findAll() {
    try {
      const colors = await this.colorService.findAll();
      return { statusCode: HttpStatus.OK, data: colors };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/find-color/:id')
  async findOne(@Param('id') id: string) {
    try {
      const color = await this.colorService.findOne(+id);
      if (!color) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Color not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { statusCode: HttpStatus.OK, data: color };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch('/update-corlor/:id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() updateColorDto: UpdateColorDto) {
    try {
      const updatedColor = await this.colorService.update(+id, updateColorDto);
      if (!updatedColor) {
        throw new HttpException(
          { statusCode: HttpStatus.NOT_FOUND, message: 'Color not found' },
          HttpStatus.NOT_FOUND,
        );
      }
      return { statusCode: HttpStatus.OK, message: 'Color updated successfully', data: updatedColor };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/delete-color/:id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    try {
      const result = await this.colorService.remove(+id);
      return { statusCode: HttpStatus.OK, message: 'Color removed successfully' };
    } catch (error) {
      throw new HttpException(
        { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
