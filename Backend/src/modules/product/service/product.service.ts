import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';
import { CategoryProduct } from 'src/modules/categoryproduct/entities/categoryproduct.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(CategoryProduct)
    private readonly categoryProductRepository: Repository<CategoryProduct>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find({
      where: { shop: true },
    });
  }
  async findAllAdmin(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findByCategory(categoryId: number): Promise<Product[]> {
    // Lấy tất cả các sản phẩm có liên kết với categoryId từ bảng CategoryProduct
    const categoryProducts = await this.categoryProductRepository.find({
      where: { category: { id: categoryId } },
      relations: ['product'], // Bao gồm thông tin sản phẩm
    });

    // Trả về mảng các sản phẩm
    return categoryProducts.map((categoryProduct) => categoryProduct.product);
  }

  async searchProducts(keyword: string): Promise<Product[]> {
    return this.productRepository.find({
      where: [{ title: Like(`%${keyword}%`) }],
    });
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
  
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  
    const updatedProduct = {
      ...product,
      ...updateProductDto,
  };

  console.log("LOI1",updatedProduct);
    return await this.productRepository.save(updatedProduct);
  }

  async updatevariant(
    id: number,
    updateData: Partial<Product>,
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
  
    if (!product) {
      throw new Error('Product not found');
    }
  
    Object.assign(product, updateData);
  
    return await this.productRepository.save(product);
  }
  

  async remove(id: number): Promise<boolean> {
    const product = await this.findOne(id);
    if (product) {
      await this.productRepository.remove(product);
      return true;
    }
    return false;
  }

  async findAllWithCategories() {
    // Sử dụng queryBuilder để tối ưu performance
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.categoryProducts', 'categoryProduct')
      .leftJoinAndSelect('categoryProduct.category', 'category')
      .leftJoinAndSelect('category.parent', 'parentCategory')
      .orderBy('product.id', 'DESC')
      .getMany();

    return products;
  }
}
