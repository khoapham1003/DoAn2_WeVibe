import { Test, TestingModule } from '@nestjs/testing';
import { CategoryproductController } from '../controller/categoryproduct.controller';
import { CategoryproductService } from '../service/categoryproduct.service';

describe('CategoryproductController', () => {
  let controller: CategoryproductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryproductController],
      providers: [CategoryproductService],
    }).compile();

    controller = module.get<CategoryproductController>(
      CategoryproductController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
