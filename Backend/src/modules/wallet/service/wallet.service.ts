import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../entities/wallet.entity';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { UpdateWalletDto } from '../dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async create(createWalletDto: CreateWalletDto): Promise<Wallet> {
    const wallet = this.walletRepository.create(createWalletDto);
    return await this.walletRepository.save(wallet);
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletRepository.find();
  }

  async findOne(id: number): Promise<Wallet> {
    const wallet = await this.walletRepository.findOne({ where: { id } });
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    return wallet;
  }

  async update(id: number, updateWalletDto: UpdateWalletDto): Promise<Wallet> {
    await this.walletRepository.update(id, updateWalletDto);
    const updatedWallet = await this.walletRepository.findOne({ where: { id } });
    if (!updatedWallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    return updatedWallet;
  }

  async remove(id: number): Promise<void> {
    const result = await this.walletRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
  }
}
