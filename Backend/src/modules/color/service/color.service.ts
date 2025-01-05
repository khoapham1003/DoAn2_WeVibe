import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateColorDto } from '../dto/create-color.dto';
import { UpdateColorDto } from '../dto/update-color.dto';
import { Color } from '../entities/color.entity';

@Injectable()
export class ColorService {
  constructor(
    @InjectRepository(Color)
    private readonly colorRepository: Repository<Color>,
  ) {}

  async checkIfHexExists(hex: string): Promise<boolean> {
    const existingColor = await this.colorRepository.findOne({
      where: { hex },
    });

    if(existingColor)
      return true;
    else
    return false;
  }
  async create(createColorDto: CreateColorDto): Promise<Color> {
    const { hex } = createColorDto;

    const exists = await this.checkIfHexExists(hex);
    if (exists) {
      throw new HttpException(
        `Color with hex code ${hex} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newColor = this.colorRepository.create(createColorDto);
    return await this.colorRepository.save(newColor);
  }
  async findAll(): Promise<Color[]> {
    return await this.colorRepository.find();
  }

  async findOne(id: number): Promise<Color> {
    const color = await this.colorRepository.findOne({ where: { id } });
    if (!color) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto): Promise<Color> {
    const color = await this.findOne(id);
    const updatedColor = this.colorRepository.merge(color, updateColorDto);
    return await this.colorRepository.save(updatedColor);
  }

  async remove(id: number): Promise<void> {
    const result = await this.colorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
  }
}
