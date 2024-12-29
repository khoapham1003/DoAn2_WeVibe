import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { ConfirmOrderDto } from '../dto/confirm-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order/:userId')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Param('userId') userId: number,
  ) {
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get('/order-statistics')
  async orderStatistics() {
    try {
      const statistics = await this.orderService.orderStatistics();
      return {
        statusCode: HttpStatus.OK,
        message: 'Order statistics fetched successfully',
        data: statistics,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/order-detail/:orderId')
  async orderDetail(@Param('orderId') orderId: number) {
    try {
      const orderDetail = await this.orderService.orderDetail(orderId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Order statistics fetched successfully',
        data: orderDetail,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/order-pending')
  async orderProcessing() {
    try {
      const orderProcessing = await this.orderService.orderProcessing();
      return {
        statusCode: HttpStatus.OK,
        message: 'Order Pending fetched successfully',
        data: orderProcessing,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/order-history/:userId')
  async orderHistory(
    @Param('userId') userId: number,
  ) {
    try {
      const orderHistory = await this.orderService.orderHistory(userId);
      return {
        statusCode: HttpStatus.OK,
        message: 'Order History fetched successfully',
        data: orderHistory,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get('/order-statistics1')
  async getOrderStatistics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.orderService.getOrderStatistics(startDate, endDate);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(+id);
  }

  @Patch('/confirm-order/:orderId')
  async confirmOrder(
    @Param('orderId') orderId: number,
    @Body() ConfirmOrderDto: ConfirmOrderDto,
  ) {
    return this.orderService.confirmOrder( orderId, ConfirmOrderDto);
  }

  @Patch(':cartId/:orderId/complete')
  async completeOrder(
    @Param('orderId') orderId: number,
    @Param('cartId') cartId: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.completeOrder(cartId, orderId, updateOrderDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return await this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.orderService.remove(+id);
  }
}
