import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const transaction = new Transaction();

    // Map thông tin từ DTO
    transaction.orderID = dto.orderId;
    transaction.amount = dto.amount;
    transaction.paymentMethodType = dto.paymentMethodType;
    transaction.status = dto.status;

    // Lưu chi tiết giao dịch nếu có
    if (dto.paymentDetails) {
      transaction.paymentDetails = dto.paymentDetails;
    } else {
      transaction.paymentDetails = JSON.stringify({
        note: 'No additional payment details provided.',
      });
    }

    // Lưu vào database
    return await this.transactionRepository.save(transaction);
  }
  findAll() {
    return `This action returns all transaction`;
  }

  async findOne(id: number): Promise<any> {
    return await this.transactionRepository.findOne({ where: { id } });
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
