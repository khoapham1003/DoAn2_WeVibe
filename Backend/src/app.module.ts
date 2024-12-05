import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Modules
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

// Guards
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './Common/Gard/role.gard';
import { CartController } from './modules/cart/controller/cart.controller';
import { OrderController } from './modules/order/controller/order.controller';
import { CartitemController } from './modules/cartitem/controller/cartitem.controller';
import { OrderItemController } from './modules/orderitem/controller/orderitem.controller';
import { UserController } from './modules/user/controller/user.controller';

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
    WalletModule,
    OrderModule,
    CartModule,
    OrderitemModule,
    CartitemModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard, // Áp dụng RolesGuard toàn bộ ứng dụng
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'color/create-color', method: RequestMethod.POST }, // Chỉ admin mới được tạo
        { path: 'color/update-corlor/:id', method: RequestMethod.PATCH }, // Chỉ admin được cập nhật
        { path: 'color/delete-color/:id', method: RequestMethod.DELETE },
        {path: '/sizes/create-size', method: RequestMethod.POST},
        {path: '/sizes/update-size/:id', method: RequestMethod.PATCH},
        {path: '/sizes/delete-size/:id', method: RequestMethod.DELETE},
        {path: '/category/create-category', method: RequestMethod.POST},
        {path: '/category/update-category/:id', method: RequestMethod.PATCH},
        {path: '/category/delete-category/:id', method: RequestMethod.DELETE},
        {path: '/product-variants/create-productvariant', method: RequestMethod.POST},
        {path: '/product-variants/update-productvariant/:id', method: RequestMethod.PATCH},
        {path: '/product-variants/delete-productvariant/:id', method: RequestMethod.DELETE},
        {path: '/category-product/create', method: RequestMethod.POST},
        {path: '/category-product/update/:id', method: RequestMethod.PATCH},
        {path: '/category-product/delete/:id', method: RequestMethod.DELETE},
        {path: '/product/create-product', method: RequestMethod.POST},
        {path: '/product/update-product/:id', method: RequestMethod.PATCH},
        {path: '/product/delete-product/:id', method: RequestMethod.DELETE},
        CartController, 
        OrderController, 
        CartitemController,
        OrderItemController,
        UserController,
      );
      // .forRoutes('orders', 'cart', 'cartitem', 'order-item', 'user', 'color');
  }
}
