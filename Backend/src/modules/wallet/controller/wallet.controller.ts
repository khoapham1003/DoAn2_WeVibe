import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { WalletService } from '../service/wallet.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post('/create-wallet')
  async create(@Body() createWalletDto: CreateWalletDto) {
    return await this.walletService.create(createWalletDto);
  }

  @Get('/get-all-wallets')
  async findAll() {
    return await this.walletService.findAll();
  }

  @Get('/find-wallet/:id')
  async findOne(@Param('id') id: number) {
    return await this.walletService.findOne(id);
  }

  @Patch('/update-wallet/:id')
  async update(
    @Param('id') id: number,
    @Body() updateWalletDto: UpdateWalletDto,
  ) {
    return await this.walletService.update(id, updateWalletDto);
  }

  @Delete('/delete-wallet/:id')
  async remove(@Param('id') id: number) {
    return await this.walletService.remove(id);
  }
}
