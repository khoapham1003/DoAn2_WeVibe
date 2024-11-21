import { Test, TestingModule } from '@nestjs/testing';
import { CategoryproductService } from '../service/categoryproduct.service';

describe('CategoryproductService', () => {
  let service: CategoryproductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryproductService],
    }).compile();

    service = module.get<CategoryproductService>(CategoryproductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
