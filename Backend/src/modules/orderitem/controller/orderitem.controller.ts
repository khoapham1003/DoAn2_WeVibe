import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderItemDto } from '../dto/create-orderitem.dto';
import { UpdateOrderItemDto } from '../dto/update-orderitem.dto';
import { OrderItemService } from '../service/orderitem.service';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post('/create-orderitems')
  async create(@Body() createOrderItemDtos: CreateOrderItemDto[]) {
    return await this.orderItemService.create(createOrderItemDtos);
  }

  @Get ('orderdata/:id')
  async findOrderData(@Param('id') id: string) {
    return await this.orderItemService.findOrderData(+id);
  }
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const orderItem = await this.orderItemService.findOne(id);
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }
    return orderItem;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return await this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.orderItemService.remove(id);
  }
}
