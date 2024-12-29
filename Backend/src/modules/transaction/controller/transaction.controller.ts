import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionService } from '../service/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('/create-transaction')
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto): Promise<any> {
    try {

      const transaction = await this.transactionService.createTransaction(createTransactionDto);

      return {
        message: 'Transaction created successfully',
        transaction,
      };
    } catch (error) {
      console.error('Error creating transaction:', error.message);
      throw error;
    }
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
