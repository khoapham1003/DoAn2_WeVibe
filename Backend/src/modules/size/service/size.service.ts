import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Size } from '../entities/size.entity';
import { CreateSizeDto } from '../dto/create-size.dto';
import { UpdateSizeDto } from '../dto/update-size.dto';

@Injectable()
export class SizeService {
  constructor(
    @InjectRepository(Size)
    private readonly sizeRepository: Repository<Size>,
  ) {}

  async checkIfNameExists(name: string): Promise<boolean> {
    const existingSize = await this.sizeRepository.findOne({
      where: { name },
    });
    if (existingSize) return true;
    else return false;
  }

  // Tạo kích thước mới
  async create(createSizeDto: CreateSizeDto): Promise<Size> {
    const { name } = createSizeDto;

    const exists = await this.checkIfNameExists(name);
    if (exists) {
      throw new HttpException(
        `Size with the name ${name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const size = this.sizeRepository.create(createSizeDto);
    return await this.sizeRepository.save(size);
  }

  async findAll(): Promise<Size[]> {
    return await this.sizeRepository.find();
  }

  async findOne(id: number): Promise<Size> {
    const size = await this.sizeRepository.findOne({ where: { id } });
    if (!size) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }
    return size;
  }

  async update(id: number, updateSizeDto: UpdateSizeDto): Promise<Size> {
    const size = await this.findOne(id);
    const { name } = updateSizeDto;

    const exists = await this.checkIfNameExists1(name, id);
    if (exists) {
      throw new HttpException(
        `Size with the name ${name} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedSize = Object.assign(size, updateSizeDto);
    return await this.sizeRepository.save(updatedSize);
  }

  async checkIfNameExists1(name: string, excludeId: number): Promise<boolean> {
    const count = await this.sizeRepository.count({
      where: {
        name,
        id: Not(excludeId),
      },
    });
  
    return count > 0;
  }

  async remove(id: number): Promise<void> {
    const result = await this.sizeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Size with ID ${id} not found`);
    }
  }
}
