import { Injectable } from '@nestjs/common';
import { CreateTypeDto } from '../dto/create-type.dto';
import { UpdateTypeDto } from '../dto/update-type.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from '../entities/type.entity';
import { Repository } from 'typeorm';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type)
    private typeRepository: Repository<Type>,
  ) {}
  create(createTypeDto: CreateTypeDto): Promise<Type> {
    const type = this.typeRepository.create(createTypeDto);
    return this.typeRepository.save(type);
  }

  findAll(): Promise<Type[]> {
    return this.typeRepository.find();
  }

  findOne(mTypeId: number): Promise<Type> {
    return this.typeRepository.findOneBy({ mTypeId });
  }

  async update(mTypeId: number, updateTypeDto: UpdateTypeDto): Promise<void> {
    await this.typeRepository.update(mTypeId, updateTypeDto);
  }

  async remove(mTypeId: number): Promise<void> {
    const type = await this.findOne(mTypeId);
    if (type) {
      type.mStatus = TYPE_STATUS.DELETE;
      this.update(mTypeId, this.toUpdateUserDto(type));
    }
  }
  toUpdateUserDto(type: Type): UpdateTypeDto {
    const updateTypeDto = new UpdateTypeDto();
    updateTypeDto.mTypeName = type.mTypeName;
    updateTypeDto.mDescription = type.mDescription;
    updateTypeDto.mStatus = type.mStatus;
    updateTypeDto.mModified = type.mModified;
    return updateTypeDto;
  }
}
