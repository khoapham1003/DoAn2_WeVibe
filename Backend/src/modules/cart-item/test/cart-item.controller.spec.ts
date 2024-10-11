import { Test, TestingModule } from '@nestjs/testing';
import { CartItemController } from '../controller/cart-item.controller';
import { CartItemService } from '../service/cart-item.service';

describe('CartItemController', () => {
  let controller: CartItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartItemController],
      providers: [CartItemService],
    }).compile();

    controller = module.get<CartItemController>(CartItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
