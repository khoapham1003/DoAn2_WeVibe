import { Test, TestingModule } from '@nestjs/testing';
import { ProductvariantService } from '../service/productvariant.service';

describe('ProductvariantService', () => {
  let service: ProductvariantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductvariantService],
    }).compile();

    service = module.get<ProductvariantService>(ProductvariantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
