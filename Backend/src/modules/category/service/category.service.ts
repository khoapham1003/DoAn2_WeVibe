import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async checkIfNameExists(title: string): Promise<boolean> {
    const existingCategory = await this.categoryRepository.findOne({
      where: { title },
    });
    if (existingCategory) return true;
    else return false;
  }

  // Tạo danh mục mới
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const { title } = createCategoryDto;

    // Kiểm tra nếu đã tồn tại danh mục với tên giống nhau
    const exists = await this.checkIfNameExists(title);
    if (exists) {
      throw new HttpException(
        `Category with the name ${title} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const newCategory = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryRepository.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id); // Gọi phương thức findOne để tìm danh mục
    const { title } = updateCategoryDto;

    // Kiểm tra nếu đã tồn tại danh mục với tên giống nhau
    const exists = await this.checkIfNameExists1(title, id);
    if (exists) {
      throw new HttpException(
        `Category with the name ${title} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedCategory = this.categoryRepository.merge(
      category,
      updateCategoryDto,
    );
    return await this.categoryRepository.save(updatedCategory);
  }

  async checkIfNameExists1(title: string, excludeId: number): Promise<boolean> {
    const count = await this.categoryRepository.count({
      where: {
        title,
        id: Not(excludeId),  // Loại trừ bản ghi có id = excludeId
      },
    });
  
    return count > 0;
  }
  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
  }
}
