import { Module } from '@nestjs/common';
import { CartitemController } from './controller/cartitem.controller';
import { CartItem } from './entities/cartitem.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItemService } from './service/cartitem.service';
import { ProductvariantModule } from '../productvariant/productvariant.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem]),
  ProductvariantModule,
  CartModule,
],
  controllers: [CartitemController],
  providers: [CartItemService],
  exports: [CartItemService, TypeOrmModule],
})
export class CartitemModule {}
