import { Module } from '@nestjs/common';
import { ItemLogService } from './service/item-log.service';
import { ItemLogController } from './controller/item-log.controller';
import { ItemLog } from './entities/item-log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ItemLog])],
  controllers: [ItemLogController],
  providers: [ItemLogService],
})
export class ItemLogModule {}
