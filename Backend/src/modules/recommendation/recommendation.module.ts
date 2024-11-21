import { Module } from '@nestjs/common';
import { RecommendationService } from './service/recommendation.service';
import { RecommendationController } from './controller/recommendation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RecommendationModule])],
  controllers: [RecommendationController],
  providers: [RecommendationService],
  exports: [RecommendationService],
})
export class RecommendationModule {}
