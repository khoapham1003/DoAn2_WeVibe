import { Test, TestingModule } from '@nestjs/testing';
import { UserbehaviorService } from '../service/userbehavior.service';

describe('UserbehaviorService', () => {
  let service: UserbehaviorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserbehaviorService],
    }).compile();

    service = module.get<UserbehaviorService>(UserbehaviorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
