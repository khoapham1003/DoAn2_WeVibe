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
import { OrderDetailService } from '../service/order_detail.service';
import { CreateOrderDetailDto } from '../dto/create-order_detail.dto';
import { UpdateOrderDetailDto } from '../dto/update-order_detail.dto';
import { OrderDetail } from '../entities/order_detail.entity';

@Controller('order-detail')
export class OrderDetailController {
  constructor(private readonly orderDetailService: OrderDetailService) {}

  @Post('/create-order-detail')
  async create(
    @Body() createOrderDetailDto: CreateOrderDetailDto,
  ): Promise<OrderDetail> {
    try {
      return await this.orderDetailService.create(createOrderDetailDto);
    } catch (error) {
      throw new HttpException(
        'Failed to create order detail',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('/get-all-order-details')
  async findAll(): Promise<OrderDetail[]> {
    return await this.orderDetailService.findAll();
  }

  @Get('/find-order-detail/:mOrderDetailId')
  async findOne(@Param('mOrderDetailId') id: string): Promise<OrderDetail> {
    const orderDetail = await this.orderDetailService.findOne(+id);
    if (!orderDetail) {
      throw new HttpException('Order detail not found', HttpStatus.NOT_FOUND);
    }
    return orderDetail;
  }

  @Patch('/update-order-detail/:mOrderDetailId')
  async update(
    @Param('mOrderDetailId') id: string,
    @Body() updateOrderDetailDto: UpdateOrderDetailDto,
  ): Promise<void> {
    const existingOrderDetail = await this.orderDetailService.findOne(+id);
    if (!existingOrderDetail) {
      throw new HttpException('Order detail not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderDetailService.update(+id, updateOrderDetailDto);
    } catch (error) {
      throw new HttpException(
        'Failed to update order detail',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('/delete-order-detail/:mOrderDetailId')
  async remove(@Param('mOrderDetailId') id: string): Promise<void> {
    const existingOrderDetail = await this.orderDetailService.findOne(+id);
    if (!existingOrderDetail) {
      throw new HttpException('Order detail not found', HttpStatus.NOT_FOUND);
    }
    try {
      await this.orderDetailService.remove(+id);
    } catch (error) {
      throw new HttpException(
        'Failed to delete order detail',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
