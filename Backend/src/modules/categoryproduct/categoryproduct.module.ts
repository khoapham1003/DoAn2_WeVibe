import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryProduct } from './entities/categoryproduct.entity';
import { CategoryProductController } from './controller/categoryproduct.controller';
import { CategoryProductService } from './service/categoryproduct.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryProduct])],
  controllers: [CategoryProductController],
  providers: [CategoryProductService],
  exports: [CategoryProductService,TypeOrmModule],
})
export class CategoryproductModule {}
