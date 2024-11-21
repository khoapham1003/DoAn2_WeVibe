import { Injectable } from '@nestjs/common';
import { CreateWallettransactionDto } from '../dto/create-wallettransaction.dto';
import { UpdateWallettransactionDto } from '../dto/update-wallettransaction.dto';

@Injectable()
export class WallettransactionService {
  create(createWallettransactionDto: CreateWallettransactionDto) {
    return 'This action adds a new wallettransaction';
  }

  findAll() {
    return `This action returns all wallettransaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} wallettransaction`;
  }

  update(id: number, updateWallettransactionDto: UpdateWallettransactionDto) {
    return `This action updates a #${id} wallettransaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} wallettransaction`;
  }
}
