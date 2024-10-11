import { Injectable } from '@nestjs/common';
import { CreateOrderStatusLogDto } from '../dto/create-order_status_log.dto';
import { UpdateOrderStatusLogDto } from '../dto/update-order_status_log.dto';
import { OrderStatusLog } from '../entities/order_status_log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';

@Injectable()
export class OrderStatusLogService {
  constructor(
    @InjectRepository(OrderStatusLog)
    private orderStatusLogRepository: Repository<OrderStatusLog>,
  ) {}

  async create(
    createOrderStatusLogDto: CreateOrderStatusLogDto,
  ): Promise<OrderStatusLog> {
    const orderStatusLog = this.orderStatusLogRepository.create(
      createOrderStatusLogDto as unknown as DeepPartial<OrderStatusLog>,
    );
    return this.orderStatusLogRepository.save(orderStatusLog);
  }

  findAll(): Promise<OrderStatusLog[]> {
    return this.orderStatusLogRepository.find();
  }

  findOne(mOrderStatusLogId: number): Promise<OrderStatusLog | null> {
    return this.orderStatusLogRepository.findOneBy({ mOrderStatusLogId });
  }

  async update(
    mOrderStatusLogId: number,
    updateOrderStatusLogDto: UpdateOrderStatusLogDto,
  ): Promise<void> {
    await this.orderStatusLogRepository.update(
      mOrderStatusLogId,
      updateOrderStatusLogDto as unknown as Partial<OrderStatusLog>,
    );
  }

  async remove(mOrderStatusLogId: number): Promise<void> {
    await this.orderStatusLogRepository.delete(mOrderStatusLogId);
  }
}
