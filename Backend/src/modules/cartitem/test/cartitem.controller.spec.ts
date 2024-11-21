import { Test, TestingModule } from '@nestjs/testing';
import { CartitemController } from './cartitem.controller';
import { CartitemService } from './cartitem.service';

describe('CartitemController', () => {
  let controller: CartitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartitemController],
      providers: [CartitemService],
    }).compile();

    controller = module.get<CartitemController>(CartitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
