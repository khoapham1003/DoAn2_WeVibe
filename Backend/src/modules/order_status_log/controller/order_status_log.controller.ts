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
import { OrderStatusLogService } from '../service/order_status_log.service';
import { CreateOrderStatusLogDto } from '../dto/create-order_status_log.dto';
import { UpdateOrderStatusLogDto } from '../dto/update-order_status_log.dto';
import { OrderStatusLog } from '../entities/order_status_log.entity';

@Controller('order-status-log')
export class OrderStatusLogController {
  constructor(private readonly orderStatusLogService: OrderStatusLogService) {}

  @Post('/create-order-status-log')
  async create(
    @Body() createOrderStatusLogDto: CreateOrderStatusLogDto,
  ): Promise<OrderStatusLog> {
    try {
      return await this.orderStatusLogService.create(createOrderStatusLogDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create order status log',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/find-all-order-status-logs')
  async findAll(): Promise<OrderStatusLog[]> {
    return await this.orderStatusLogService.findAll();
  }

  @Get('/find-order-status-log/:mOrderStatusLogId')
  async findOne(
    @Param('mOrderStatusLogId') id: string,
  ): Promise<OrderStatusLog> {
    const orderStatusLog = await this.orderStatusLogService.findOne(+id);
    if (!orderStatusLog) {
      throw new HttpException(
        'Order status log not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return orderStatusLog;
  }

  @Patch('/update-order-status-log/:mOrderStatusLogId')
  async update(
    @Param('mOrderStatusLogId') id: string,
    @Body() updateOrderStatusLogDto: UpdateOrderStatusLogDto,
  ): Promise<void> {
    const existingOrderStatusLog =
      await this.orderStatusLogService.findOne(+id);
    if (!existingOrderStatusLog) {
      throw new HttpException(
        'Order status log not found',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await this.orderStatusLogService.update(+id, updateOrderStatusLogDto);
    } catch (error) {
      throw new HttpException(
        'Failed to update order status log',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/delete-order-status-log/:mOrderStatusLogId')
  async remove(@Param('mOrderStatusLogId') id: string): Promise<void> {
    const existingOrderStatusLog =
      await this.orderStatusLogService.findOne(+id);
    if (!existingOrderStatusLog) {
      throw new HttpException(
        'Order status log not found',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      await this.orderStatusLogService.remove(+id);
    } catch (error) {
      throw new HttpException(
        'Failed to delete order status log',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
