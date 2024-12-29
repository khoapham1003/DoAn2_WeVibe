import { Test, TestingModule } from '@nestjs/testing';
import { ProductvariantController } from '../controller/productvariant.controller';
import { ProductvariantService } from '../service/productvariant.service';

describe('ProductvariantController', () => {
  let controller: ProductvariantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductvariantController],
      providers: [ProductvariantService],
    }).compile();

    controller = module.get<ProductvariantController>(ProductvariantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
