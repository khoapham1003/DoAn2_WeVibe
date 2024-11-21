import { Test, TestingModule } from '@nestjs/testing';
import { SizeController } from '../controller/size.controller';
import { SizeService } from '../service/size.service';

describe('SizeController', () => {
  let controller: SizeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SizeController],
      providers: [SizeService],
    }).compile();

    controller = module.get<SizeController>(SizeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
