import { Module } from '@nestjs/common';
import { OrderStatusLogService } from './service/order_status_log.service';
import { OrderStatusLogController } from './controller/order_status_log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderStatusLog } from './entities/order_status_log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderStatusLog])],
  controllers: [OrderStatusLogController],
  providers: [OrderStatusLogService],
})
export class OrderStatusLogModule {}
