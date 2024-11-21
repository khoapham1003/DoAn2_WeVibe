import { Test, TestingModule } from '@nestjs/testing';
import { CartitemService } from '../service/cartitem.service';

describe('CartitemService', () => {
  let service: CartitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartitemService],
    }).compile();

    service = module.get<CartitemService>(CartitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
