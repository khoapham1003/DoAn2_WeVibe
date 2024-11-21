import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderItem } from '../entities/orderitem.entity';
import { CreateOrderItemDto } from '../dto/create-orderitem.dto';
import { UpdateOrderItemDto } from '../dto/update-orderitem.dto';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  async create(createOrderItemDtos: CreateOrderItemDto[]): Promise<OrderItem[]> {
    const orderItems = this.orderItemRepository.create(createOrderItemDtos);
  
    return await this.orderItemRepository.save(orderItems);
  }

  async findOrderData(orderId: number): Promise<OrderItem[]> {
    // Tìm tất cả order items theo orderId
    const orderItems = await this.orderItemRepository.find({
      where: { orderID: orderId },
    });
  
    if (!orderItems || orderItems.length === 0) {
      throw new NotFoundException(`No OrderItems found for Order ID ${orderId}`);
    }
  
    return orderItems;
  }
    
  async findOne(id: number): Promise<OrderItem | null> {
    return await this.orderItemRepository.findOne({ where: { id } });
  }

  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    const orderItems = await this.orderItemRepository.find({
      where: { orderID: orderId }, // Truy vấn tất cả OrderItems với orderId tương ứng
    });

    if (!orderItems.length) {
      throw new NotFoundException(`No order items found for Order ID ${orderId}`);
    }

    return orderItems;
  }
  async update(
    id: number,
    updateOrderItemDto: UpdateOrderItemDto,
  ): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
    Object.assign(orderItem, updateOrderItemDto);
    return await this.orderItemRepository.save(orderItem);
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderItemRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Order item not found');
    }
  }
}
