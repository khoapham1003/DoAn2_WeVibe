import { Test, TestingModule } from '@nestjs/testing';
import { ItemLogController } from '../controller/item-log.controller';
import { ItemLogService } from '../service/item-log.service';

describe('ItemLogController', () => {
  let controller: ItemLogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemLogController],
      providers: [ItemLogService],
    }).compile();

    controller = module.get<ItemLogController>(ItemLogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
