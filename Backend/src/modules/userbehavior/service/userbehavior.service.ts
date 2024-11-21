import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserBehavior } from '../entities/userbehavior.entity';
import { CreateUserBehaviorDto } from '../dto/create-userbehavior.dto';
import { UpdateUserBehaviorDto } from '../dto/update-userbehavior.dto';

@Injectable()
export class UserBehaviorService {
  constructor(
    @InjectRepository(UserBehavior)
    private readonly userBehaviorRepository: Repository<UserBehavior>,
  ) {}

  async create(createUserBehaviorDto: CreateUserBehaviorDto): Promise<UserBehavior> {
    const userBehavior = this.userBehaviorRepository.create({
      ...createUserBehaviorDto,
      timestamp: createUserBehaviorDto.timestamp || new Date(), // Nếu không có timestamp, sử dụng thời gian hiện tại
    });
    return await this.userBehaviorRepository.save(userBehavior);
  }

  async findAll(): Promise<UserBehavior[]> {
    return await this.userBehaviorRepository.find();
  }

  async findOne(id: number): Promise<UserBehavior> {
    const userBehavior = await this.userBehaviorRepository.findOne({ where: { id } });
    if (!userBehavior) {
      throw new NotFoundException(`UserBehavior with ID ${id} not found`);
    }
    return userBehavior;
  }

  async update(id: number, updateUserBehaviorDto: UpdateUserBehaviorDto): Promise<UserBehavior> {
    const userBehavior = await this.findOne(id);
    const updatedUserBehavior = this.userBehaviorRepository.merge(userBehavior, updateUserBehaviorDto);
    return await this.userBehaviorRepository.save(updatedUserBehavior);
  }

  async remove(id: number): Promise<void> {
    const result = await this.userBehaviorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`UserBehavior with ID ${id} not found`);
    }
  }
}
