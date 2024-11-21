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
import { CurrencyService } from '../service/currency.service';
import { CreateCurrencyDto } from '../dto/create-currency.dto';
import { UpdateCurrencyDto } from '../dto/update-currency.dto';

@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @Post('/create-currency')
  async create(@Body() createCurrencyDto: CreateCurrencyDto) {
    try {
      const newCurrency = await this.currencyService.create(createCurrencyDto);
      return { statusCode: HttpStatus.CREATED, message: 'Currency created', data: newCurrency };
    } catch (error) {
      throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: error.message }, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/get-all-currencies')
  async findAll() {
    const currencies = await this.currencyService.findAll();
    return { statusCode: HttpStatus.OK, data: currencies };
  }

  @Get('/find-currency/:id')
  async findOne(@Param('id') id: string) {
    const currency = await this.currencyService.findOne(+id);
    if (!currency) {
      throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'Currency not found' }, HttpStatus.NOT_FOUND);
    }
    return { statusCode: HttpStatus.OK, data: currency };
  }

  @Patch('/update-currency/:id')
  async update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    const updatedCurrency = await this.currencyService.update(+id, updateCurrencyDto);
    if (!updatedCurrency) {
      throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'Currency not found' }, HttpStatus.NOT_FOUND);
    }
    return { statusCode: HttpStatus.OK, message: 'Currency updated', data: updatedCurrency };
  }

  @Delete('/delete-currency/:id')
  async remove(@Param('id') id: string) {
    const deletedCurrency = await this.currencyService.remove(+id);
    if (!deletedCurrency) {
      throw new HttpException({ statusCode: HttpStatus.NOT_FOUND, message: 'Currency not found' }, HttpStatus.NOT_FOUND);
    }
    return { statusCode: HttpStatus.OK, message: 'Currency deleted' };
  }
}
