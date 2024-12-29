import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBehavior } from './entities/userbehavior.entity';
import { UserBehaviorController } from './controller/userbehavior.controller';
import { UserBehaviorService } from './service/userbehavior.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserBehavior])],
  controllers: [UserBehaviorController],
  providers: [UserBehaviorService],
  exports: [UserBehaviorService],
})
export class UserbehaviorModule {}
