import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Repository } from 'typeorm';
import { ORDER_STATUS } from 'src/shared/constants/order-status.const';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    if (!createOrderDto.mStatus) {
      createOrderDto.mStatus = ORDER_STATUS.PENDING;
    }

    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(mOrderId: number): Promise<Order | null> {
    const order = await this.orderRepository.findOneBy({ mOrderId });
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  async update(
    mOrderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    updateOrderDto.mModified = new Date().toISOString();

    const order = await this.findOne(mOrderId);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    await this.orderRepository.update(mOrderId, updateOrderDto);
  }

  async remove(mOrderId: number): Promise<void> {
    const order = await this.findOne(mOrderId);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    order.mStatus = ORDER_STATUS.CANCELLED;
    order.mModified = new Date().toISOString();
    await this.update(mOrderId, this.toUpdateOrderDto(order));
  }

  private toUpdateOrderDto(order: Order): UpdateOrderDto {
    const updateOrderDto = new UpdateOrderDto();
    updateOrderDto.mStatus = order.mStatus;
    updateOrderDto.mTotalAmount = order.mTotalAmount;
    updateOrderDto.mPaymentMethod = order.mPaymentMethod;
    updateOrderDto.mModified = order.mModified;
    return updateOrderDto;
  }
}
