import { Test, TestingModule } from '@nestjs/testing';
import { WallettransactionService } from '../service/wallettransaction.service';

describe('WallettransactionService', () => {
  let service: WallettransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WallettransactionService],
    }).compile();

    service = module.get<WallettransactionService>(WallettransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
