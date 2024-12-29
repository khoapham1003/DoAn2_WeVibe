import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductVariant } from './entities/productvariant.entity';
import { ProductVariantController } from './controller/productvariant.controller';
import { ProductVariantService } from './service/productvariant.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProductVariant])],
  controllers: [ProductVariantController],
  providers: [ProductVariantService],
  exports: [ProductVariantService,
    TypeOrmModule
  ],
})
export class ProductvariantModule {}
