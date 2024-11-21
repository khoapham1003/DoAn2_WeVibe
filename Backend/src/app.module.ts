import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Module
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './config/database.config';
import { ColorModule } from './modules/color/color.module';
import { CurrencyModule } from './modules/currency/currency.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { CategoryproductModule } from './modules/categoryproduct/categoryproduct.module';
import { UserbehaviorModule } from './modules/userbehavior/userbehavior.module';
import { SizeModule } from './modules/size/size.module';
import { ProductvariantModule } from './modules/productvariant/productvariant.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { OrderModule } from './modules/order/order.module';
import { CartModule } from './modules/cart/cart.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { WallettransactionModule } from './modules/wallettransaction/wallettransaction.module';
import { OrderitemModule } from './modules/orderitem/orderitem.module';
import { CartitemModule } from './modules/cartitem/cartitem.module';
 import { AuthModule } from './modules/auth/auth.module';
import { AuthMiddleware } from './Common/middlewares/auth.middleware';

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
  UserbehaviorModule,
  ColorModule,
  CurrencyModule,
 ProductModule,
  ProductvariantModule,
 CategoryModule,
  CategoryproductModule,
  SizeModule,
 // RecommendationModule,
  WalletModule,
  OrderModule,
 CartModule,
 // TransactionModule,
 // WallettransactionModule,
 OrderitemModule,
 CartitemModule,
 AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(AuthMiddleware)
    .forRoutes('orders', 'cart', 'cartitem', 'order-item', 'user'); 
}}
