import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusLogController } from '../controller/order_status_log.controller';
import { OrderStatusLogService } from '../service/order_status_log.service';

describe('OrderStatusLogController', () => {
  let controller: OrderStatusLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderStatusLogController],
      providers: [OrderStatusLogService],
    }).compile();

    controller = module.get<OrderStatusLogController>(OrderStatusLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
