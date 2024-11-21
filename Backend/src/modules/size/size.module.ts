import { Module } from '@nestjs/common';
import { SizeController } from './controller/size.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SizeService } from './service/size.service';
import { Size } from './entities/size.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Size])],
  controllers: [SizeController],
  providers: [SizeService],
  exports: [SizeService],
})
export class SizeModule {}
