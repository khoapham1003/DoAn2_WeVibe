import { Test, TestingModule } from '@nestjs/testing';
import { UserbehaviorController } from '../controller/userbehavior.controller';
import { UserbehaviorService } from './userbehavior.service';

describe('UserbehaviorController', () => {
  let controller: UserbehaviorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserbehaviorController],
      providers: [UserbehaviorService],
    }).compile();

    controller = module.get<UserbehaviorController>(UserbehaviorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
