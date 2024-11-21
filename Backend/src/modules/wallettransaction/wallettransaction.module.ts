import { Module } from '@nestjs/common';
import { WallettransactionService } from './service/wallettransaction.service';
import { WallettransactionController } from './controller/wallettransaction.controller';

@Module({
  controllers: [WallettransactionController],
  providers: [WallettransactionService],
})
export class WallettransactionModule {}
