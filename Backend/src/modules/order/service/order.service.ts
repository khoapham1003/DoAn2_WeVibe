import { ConfirmOrderDto } from './../dto/confirm-order.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderItem } from 'src/modules/orderitem/entities/orderitem.entity';
import { CartItem } from 'src/modules/cartitem/entities/cartitem.entity';
import { CartItemService } from 'src/modules/cartitem/service/cartitem.service';
import { Product } from 'src/modules/product/entities/product.entity';
import { ProductVariant } from 'src/modules/productvariant/entities/productvariant.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';

@Injectable()
export class OrderService {
  constructor(
    private readonly CartItemService: CartItemService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
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

    const orderItems = await this.orderItemRepository.find({
      where: { orderID: orderId },
      relations: ['productVariant'],
    });

    if (!orderItems.length) {
      throw new NotFoundException(
        `No items found for Order with ID ${orderId}`,
      );
    }

    // Trừ quantity trong productVariant và cập nhật product
    for (const orderItem of orderItems) {
      const productVariant = orderItem.productVariant;

      if (!productVariant) {
        throw new NotFoundException(
          `ProductVariant with ID ${orderItem.productVID} not found`,
        );
      }

      // Trừ số lượng
      productVariant.quantity -= orderItem.quantity;

      if (productVariant.quantity < 0) {
        throw new BadRequestException(
          `Insufficient stock for ProductVariant with ID ${productVariant.id}`,
        );
      }

      await this.productVariantRepository.save(productVariant);

      const productVariants = await this.productVariantRepository.find({
        where: { productId: productVariant.productId },
      });

      const totalQuantity = productVariants.reduce(
        (total, variant) => total + variant.quantity,
        0,
      );

      // Cập nhật lại quantity của product
      const product = await this.productRepository.findOne({
        where: { id: productVariant.productId },
      });

      if (product) {
        product.quantity = totalQuantity;
        if (product.quantity === 0) {
          product.shop = false;
        }
        await this.productRepository.save(product);
      }
    }

    return updatedOrder;
  }

  async confirmOrder(
    orderId: number,
    ConfirmOrderDto: ConfirmOrderDto,
  ): Promise<Order> {
    await this.orderRepository.update(orderId, ConfirmOrderDto);
    const updatedOrder = await this.orderRepository.findOne({
      where: { id: orderId },
    });
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    updatedOrder.status = 'COMPLETED';
    await this.orderRepository.save(updatedOrder);

    return updatedOrder;
  }

  async orderProcessing(): Promise<any> {
    const orders = await this.orderRepository.find({
      where: [{ status: 'PENDING' }, { status: 'COMPLETED' }],
    });

    // Trả về dữ liệu định dạng phù hợp
    return orders.map((order) => ({
      id: order.id,
      address: {
        line1: order.line1,
        line2: order.line2,
        city: order.city,
        province: order.province,
        country: order.country,
        name: order.lastName + ' ' + order.middleName + ' ' + order.firstName,
        phone: order.phoneNumber,
      },
      createAt: order.createdAt,
      status: order.status,
      subTotal: order.subTotal,
      totalDiscount: order.totalDiscount,
      shippingFee: order.shippingFee,
      grandTotal: order.grandTotal,
    }));
  }

  async orderHistory(userId: number): Promise<any> {
    // Lấy tất cả các đơn hàng có status là 'Pending' hoặc 'Complete'
    const orders = await this.orderRepository.find({
      where: [
        { userId: userId, status: 'PENDING' },
        { userId: userId, status: 'COMPLETED' },
      ],
    });

    // Trả về dữ liệu định dạng phù hợp
    return orders.map((order) => ({
      id: order.id,
      address: {
        line1: order.line1,
        line2: order.line2,
        city: order.city,
        province: order.province,
        country: order.country,
        name: order.lastName + ' ' + order.middleName + ' ' + order.firstName,
        phone: order.phoneNumber,
      },
      createAt: order.createdAt,
      status: order.status,
      subTotal: order.subTotal,
      totalDiscount: order.totalDiscount,
      shippingFee: order.shippingFee,
      grandTotal: order.grandTotal,
    }));
  }
  async orderDetail(orderId: number): Promise<any> {
    const orderDetail = await this.orderRepository.find({
      where: { id: orderId },
    });
    if (!orderDetail) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const orderItems = await this.orderItemRepository.find({
      where: { orderID: orderId },
    });

    const orderBlockchain = await this.transactionRepository.find({
      where: {
        orderID: orderId,
      } as any,
    });

    console.log('23123',orderBlockchain);

    if (!orderItems.length) {
      throw new NotFoundException(
        `No items found for Order with ID ${orderId}`,
      );
    }

    return orderDetail.map((order) => ({
      id: order.id,
      address: {
        line1: order.line1,
        line2: order.line2,
        city: order.city,
        province: order.province,
        country: order.country,
        firstName: order.firstName,
        middleName: order.middleName,
        lastName: order.lastName,
        phone: order.phoneNumber,
        email: order.email,
      },
      status: order.status,
      subTotal: order.subTotal,
      totalDiscount: order.totalDiscount,
      shippingFee: order.shippingFee,
      grandTotal: order.grandTotal,
      items: orderItems
        .filter((item) => item.orderID === order.id)
        .map((item) => ({
          productName: item.productVariant.product.title,
          picture: item.productVariant.product.picture,
          quantity: item.quantity,
          price: item.price,
          totalPrice: item.quantity * item.price,
          size: item.productVariant.size.name,
          color: item.productVariant.color.name,
        })),
      orderBlockchain: orderBlockchain,
    }));
  }

  async orderStatistics(): Promise<any> {
    const queryBuilder = this.orderRepository.createQueryBuilder('order');

    // Tổng số đơn hàng với trạng thái PENDING
    const totalOrders = await queryBuilder
      .where('order.status = :status', { status: 'PENDING' })
      .getCount();

    const totalPendingGrandTotal = await queryBuilder
      .select('SUM(order.sub_total)', 'total')
      .where('order.status = :status', { status: 'PENDING' })
      .getRawOne();

    const totalQuantity = await this.orderRepository
      .createQueryBuilder('order')
      .innerJoin('order.orderItems', 'orderItem') // Kết nối với bảng OrderItem
      .select('SUM(orderItem.quantity)', 'totalQuantity') // Đếm tổng quantity
      .where('order.status = :status', { status: 'PENDING' })
      .getRawOne();

    return {
      totalOrders,
      totalGrandTotal: totalPendingGrandTotal.total || 0,
      totalQuantity: totalQuantity.totalQuantity || 0,
    };
  }
  async getOrderStatistics(startDate?: string, endDate?: string): Promise<any> {
    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.orderItems', 'orderItem');

    if (startDate && endDate) {
      queryBuilder.where('order.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      });
    }

    const orders = await queryBuilder.getMany();

    return orders.map((order) => ({
      createdAt: order.createdAt,
      totalPrice: Number(order.subTotal),
      orderItems: order.orderItems.map((item) => ({
        amount: item.quantity,
      })),
    }));
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
