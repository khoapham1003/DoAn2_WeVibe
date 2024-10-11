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
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Order } from '../entities/order.entity';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order')
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.orderService.create(createOrderDto);
    } catch (error) {
      throw new HttpException('Failed to create order', HttpStatus.BAD_REQUEST);
    }
  }

  @Get('/get-all-order')
  async findAll(): Promise<Order[]> {
    return await this.orderService.findAll();
  }

  @Get('/find-order/:mOrderId')
  async findOne(@Param('mOrderId') id: string): Promise<Order> {
    const order = await this.orderService.findOne(+id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @Patch('/update-order/:mOrderId')
  async update(
    @Param('mOrderId') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<void> {
    const existingOrder = await this.orderService.findOne(+id);
    if (!existingOrder) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderService.update(+id, updateOrderDto);
    } catch (error) {
      throw new HttpException('Failed to update order', HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('/delete-order/:mOrderId')
  async remove(@Param('mOrderId') id: string): Promise<void> {
    const existingOrder = await this.orderService.findOne(+id);
    if (!existingOrder) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderService.remove(+id);
    } catch (error) {
      throw new HttpException('Failed to delete order', HttpStatus.BAD_REQUEST);
    }
  }
}
