import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderitemModule } from '../orderitem/orderitem.module';
import { CartitemModule } from '../cartitem/cartitem.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order]),
  CartitemModule,
  OrderitemModule,
],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
