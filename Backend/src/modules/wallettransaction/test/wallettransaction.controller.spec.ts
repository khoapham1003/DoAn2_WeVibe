import { Test, TestingModule } from '@nestjs/testing';
import { WallettransactionController } from '../controller/wallettransaction.controller';
import { WallettransactionService } from '../service/wallettransaction.service';

describe('WallettransactionController', () => {
  let controller: WallettransactionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WallettransactionController],
      providers: [WallettransactionService],
    }).compile();

    controller = module.get<WallettransactionController>(
      WallettransactionController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
