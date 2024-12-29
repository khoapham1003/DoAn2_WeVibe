import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationController } from '../controller/recommendation.controller';
import { RecommendationService } from '../service/recommendation.service';

describe('RecommendationController', () => {
  let controller: RecommendationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecommendationController],
      providers: [RecommendationService],
    }).compile();

    controller = module.get<RecommendationController>(RecommendationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
