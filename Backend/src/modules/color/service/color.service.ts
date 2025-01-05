import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
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

    if (existingColor) return true;
    else return false;
  }
  async create(createColorDto: CreateColorDto): Promise<Color> {
    let { hex } = createColorDto;

    if (!hex.startsWith('#')) {
      hex = '#' + hex;
    }

    console.log(hex);
    // Kiểm tra tính hợp lệ của mã hex (phải có # và 6 ký tự hex hợp lệ)
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (!hexPattern.test(hex)) {
      throw new HttpException(
        'Invalid hex color code. It should start with # and be followed by exactly 6 hex characters (0-9, A-F)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.checkIfHexExists(hex);
    if (exists) {
      throw new HttpException(
        `Color with hex code ${hex} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    createColorDto.hex = hex;

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
    let { hex } = updateColorDto;

    if (!hex.startsWith('#')) {
      hex = '#' + hex; // Thêm dấu # vào trước mã hex
    }

    // Kiểm tra tính hợp lệ của mã hex (phải có # và 6 ký tự hex hợp lệ)
    const hexPattern = /^#[0-9A-Fa-f]{6}$/;
    if (!hexPattern.test(hex)) {
      throw new HttpException(
        'Invalid hex color code. It should start with # and be followed by exactly 6 hex characters (0-9, A-F)',
        HttpStatus.BAD_REQUEST,
      );
    }

    const exists = await this.checkIfHexExists1(hex, id);
    if (exists) {
      throw new HttpException(
        `Color with hex code ${hex} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    updateColorDto.hex = hex;

    const updatedColor = this.colorRepository.merge(color, updateColorDto);
    return await this.colorRepository.save(updatedColor);
  }
  async checkIfHexExists1(hex: string, excludeId: number): Promise<boolean> {
    const count = await this.colorRepository.count({
      where: {
        hex,
        id: Not(excludeId),  // Loại trừ bản ghi có id = excludeId
      },
    });
  
    return count > 0;
  }
  async remove(id: number): Promise<void> {
    const result = await this.colorRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Color with ID ${id} not found`);
    }
  }
}
