import { Injectable } from '@nestjs/common';
import { CreateItemLogDto } from '../dto/create-item-log.dto';
import { UpdateItemLogDto } from '../dto/update-item-log.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemLog } from '../entities/item-log.entity';
import { Repository } from 'typeorm';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

@Injectable()
export class ItemLogService {
  constructor(
    @InjectRepository(ItemLog)
    private itemLogRepository: Repository<ItemLog>,
  ) {}

  create(createItemLogDto: CreateItemLogDto): Promise<ItemLog> {
    const itemLog = this.itemLogRepository.create(
      createItemLogDto as unknown as Partial<ItemLog>,
    );
    return this.itemLogRepository.save(itemLog);
  }

  findAll(): Promise<ItemLog[]> {
    return this.itemLogRepository.find();
  }

  findOne(mItemLogId: number): Promise<ItemLog> {
    return this.itemLogRepository.findOneBy({ mItemLogId });
  }

  async update(
    mItemLogId: number,
    updateItemLogDto: UpdateItemLogDto,
  ): Promise<void> {
    await this.itemLogRepository.update(
      mItemLogId,
      updateItemLogDto as unknown as Partial<ItemLog>,
    );
  }

  async remove(mItemLogId: number): Promise<void> {
    const itemLog = await this.findOne(mItemLogId);
    if (itemLog) {
      itemLog.mStatus = TYPE_STATUS.DELETE;
      await this.update(mItemLogId, this.toUpdateItemLogDto(itemLog));
    }
  }

  toUpdateItemLogDto(itemLog: ItemLog): UpdateItemLogDto {
    const itemLogDto = new UpdateItemLogDto();
    itemLogDto.mChangeDescription = itemLog.mChangeDescription;
    itemLogDto.mModified = itemLog.mModified;
    itemLogDto.mProductId = itemLog.mProductId.mProductId;
    itemLogDto.mQuantity = itemLog.mQuantity;
    itemLogDto.mStatus = itemLog.mStatus;
    return itemLogDto;
  }
}
