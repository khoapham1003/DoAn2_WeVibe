import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ItemLogService } from '../service/item-log.service';
import { CreateItemLogDto } from '../dto/create-item-log.dto';
import { UpdateItemLogDto } from '../dto/update-item-log.dto';
import { ItemLog } from '../entities/item-log.entity';

@Controller('item-log')
export class ItemLogController {
  constructor(private readonly itemLogService: ItemLogService) {}

  @Post('/create-item-log')
  async create(@Body() createItemLogDto: CreateItemLogDto): Promise<ItemLog> {
    return await this.itemLogService.create(createItemLogDto);
  }

  @Get('/get-add-item-log')
  async findAll(): Promise<ItemLog[]> {
    return await this.itemLogService.findAll();
  }

  @Get('/find-item-log/:mItemLogId')
  async findOne(
    @Param('mItemLogId') mItemLogId: number,
  ): Promise<ItemLog | null> {
    const itemLog = await this.itemLogService.findOne(Number(mItemLogId));
    if (!itemLog) {
      throw new HttpException('Item log not found', HttpStatus.NOT_FOUND);
    }
    return itemLog;
  }

  @Patch('/update-item-log/:mItemLogId')
  async update(
    @Param('mItemLogId') mItemLogId: number,
    @Body() updateItemLogDto: UpdateItemLogDto,
  ): Promise<void> {
    return await this.itemLogService.update(
      Number(mItemLogId),
      updateItemLogDto,
    );
  }

  @Delete('/delete-item-log/:mItemLogId')
  async remove(@Param('mItemLogId') mItemLogId: number): Promise<void> {
    return await this.itemLogService.remove(Number(mItemLogId));
  }
}
