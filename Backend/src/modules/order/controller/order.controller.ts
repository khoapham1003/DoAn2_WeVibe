import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { OrderService } from '../service/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/create-order/:userId')
  async createOrder(
    @Body() createOrderDto: CreateOrderDto, 
    @Param('userId') userId: number
  ) {
    return this.orderService.createOrder(createOrderDto, userId);
  }

  @Get()
  async findAll() {
    return await this.orderService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.orderService.findOne(+id);
  }


  @Patch(':cartId/:orderId/complete')
  async completeOrder(@Param('orderId') orderId: number,
  @Param('cartId') cartId:number,
  @Body() updateOrderDto: UpdateOrderDto,
) {
    return this.orderService.completeOrder(cartId,orderId, updateOrderDto);
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
