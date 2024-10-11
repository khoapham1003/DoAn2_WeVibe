import { Test, TestingModule } from '@nestjs/testing';
import { OrderStatusLogService } from '../service/order_status_log.service';

describe('OrderStatusLogService', () => {
  let service: OrderStatusLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderStatusLogService],
    }).compile();

    service = module.get<OrderStatusLogService>(OrderStatusLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
