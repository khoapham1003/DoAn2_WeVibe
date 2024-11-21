import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderitem.entity';
import { OrderItemController } from './controller/orderitem.controller';
import { OrderItemService } from './service/orderitem.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  controllers: [OrderItemController],
  providers: [OrderItemService],
  exports: [OrderItemService, TypeOrmModule],
})
export class OrderitemModule {}
