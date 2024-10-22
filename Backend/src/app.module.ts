import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeModule } from './modules/type/type.module';
import { AdminModule } from './modules/admin/admin.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { ItemLogModule } from './modules/item-log/item-log.module';
import { OrderModule } from './modules/order/order.module';
import { OrderDetailModule } from './modules/order_detail/order_detail.module';
import { OrderStatusLogModule } from './modules/order_status_log/order_status_log.module';
import { TypeOrmConfigService } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
 UserModule,
 TypeModule,
    AdminModule,
 ProductModule,
 CartModule,
 CartItemModule,
 ItemLogModule,
 OrderModule,
 OrderDetailModule,
 OrderStatusLogModule,
 AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
