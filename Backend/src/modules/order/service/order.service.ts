import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderItem } from 'src/modules/orderitem/entities/orderitem.entity';
import { CartItem } from 'src/modules/cartitem/entities/cartitem.entity';
import { CartItemService } from 'src/modules/cartitem/service/cartitem.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly CartItemService: CartItemService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
  ) {}

  async createOrder(
    createOrderDto: CreateOrderDto,
    userId: number,
  ): Promise<Order> {
    const { subTotal, totalDiscount } = createOrderDto;

    const order = this.orderRepository.create({
      userId,
      status: 'CREATED',
      subTotal,
      totalDiscount,
    });
    const savedOrder = await this.orderRepository.save(order);

    setTimeout(
      async () => {
        const updatedOrder = await this.orderRepository.findOne({
          where: { id: savedOrder.id },
        });
        if (updatedOrder && updatedOrder.status === 'CREATED') {
          updatedOrder.status = 'CANCEL';
          await this.orderRepository.save(updatedOrder);
        }
      },
      30 * 60 * 1000,
    );

    return savedOrder;
  }

  async completeOrder(
    cartId: number,
    orderId: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    await this.orderRepository.update(orderId, updateOrderDto);
    const updatedOrder = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    updatedOrder.status = 'PENDING';

    const cartItems = await this.CartItemService.findCartData(cartId);
    if (!cartItems || cartItems.length === 0) {
      throw new NotFoundException(`No CartItems found for Cart ID ${cartId}`);
    }

    for (const cartItem of cartItems) {
      console.log(cartItem);
      await this.cartItemRepository.update(cartItem.id, { active: false });
    }

    return updatedOrder;
  }
  async findAll(): Promise<Order[]> {
    return await this.orderRepository.find();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.orderRepository.update(id, updateOrderDto);
    const updatedOrder = await this.orderRepository.findOne({ where: { id } });
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return updatedOrder;
  }

  async remove(id: number): Promise<void> {
    const result = await this.orderRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
  }
}
