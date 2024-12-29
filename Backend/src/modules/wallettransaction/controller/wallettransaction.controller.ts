import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WallettransactionService } from '../service/wallettransaction.service';
import { CreateWallettransactionDto } from '../dto/create-wallettransaction.dto';
import { UpdateWallettransactionDto } from '../dto/update-wallettransaction.dto';

@Controller('wallettransaction')
export class WallettransactionController {
  constructor(
    private readonly wallettransactionService: WallettransactionService,
  ) {}

  @Post()
  create(@Body() createWallettransactionDto: CreateWallettransactionDto) {
    return this.wallettransactionService.create(createWallettransactionDto);
  }

  @Get()
  findAll() {
    return this.wallettransactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wallettransactionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWallettransactionDto: UpdateWallettransactionDto,
  ) {
    return this.wallettransactionService.update(
      +id,
      updateWallettransactionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wallettransactionService.remove(+id);
  }
}
