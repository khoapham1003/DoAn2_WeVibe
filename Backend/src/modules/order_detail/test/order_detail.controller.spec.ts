import { Test, TestingModule } from '@nestjs/testing';
import { OrderDetailController } from '../controller/order_detail.controller';
import { OrderDetailService } from '../service/order_detail.service';

describe('OrderDetailController', () => {
  let controller: OrderDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderDetailController],
      providers: [OrderDetailService],
    }).compile();

    controller = module.get<OrderDetailController>(OrderDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
