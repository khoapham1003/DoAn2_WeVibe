import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryProduct } from '../entities/categoryproduct.entity';
import { CreateCategoryProductDto } from '../dto/create-categoryproduct.dto';
import { UpdateCategoryProductDto } from '../dto/update-categoryproduct.dto';

@Injectable()
export class CategoryProductService {
  constructor(
    @InjectRepository(CategoryProduct)
    private readonly categoryProductRepository: Repository<CategoryProduct>,
  ) {}

  async create(createCategoryProductDto: CreateCategoryProductDto): Promise<CategoryProduct> {
    const categoryProduct = this.categoryProductRepository.create(createCategoryProductDto);
    return await this.categoryProductRepository.save(categoryProduct);
  }

  async findAll(): Promise<CategoryProduct[]> {
    return await this.categoryProductRepository.find();
  }

  async findOne(id: number): Promise<CategoryProduct> {
    const categoryProduct = await this.categoryProductRepository.findOne({ where: { id } });
    if (!categoryProduct) {
      throw new NotFoundException(`CategoryProduct with ID ${id} not found`);
    }
    return categoryProduct;
  }

  async update(id: number, updateCategoryProductDto: UpdateCategoryProductDto): Promise<CategoryProduct> {
    const categoryProduct = await this.findOne(id);
    const updatedCategoryProduct = this.categoryProductRepository.merge(categoryProduct, updateCategoryProductDto);
    return await this.categoryProductRepository.save(updatedCategoryProduct);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryProductRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`CategoryProduct with ID ${id} not found`);
    }
  }
}
