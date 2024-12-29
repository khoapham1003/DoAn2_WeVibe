import { Module } from '@nestjs/common';
import { OrderService } from './service/order.service';
import { OrderController } from './controller/order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderitemModule } from '../orderitem/orderitem.module';
import { CartitemModule } from '../cartitem/cartitem.module';
import { ProductModule } from '../product/product.module';
import { ProductvariantModule } from '../productvariant/productvariant.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    CartitemModule,
    OrderitemModule,
    ProductModule,
    ProductvariantModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService, TypeOrmModule],
})
export class OrderModule {}
