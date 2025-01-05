import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../entities/productvariant.entity';
import { CreateProductVariantDto } from '../dto/create-productvariant.dto';
import { UpdateProductVariantDto } from '../dto/update-productvariant.dto';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
  ) {}

  async checkIfExists(productId: number, sizeId: number, colorId: number): Promise<boolean> {
    const existingVariant = await this.productVariantRepository.findOne({
      where: {
        productId: productId,
        sizeId: sizeId,
        colorId: colorId,
      },
    });

   if(
    existingVariant) {
      return true;
    } else {
      return false;
    };
  }

  async create(createProductVariantDto: CreateProductVariantDto): Promise<ProductVariant> {
    const { productId, sizeId, colorId } = createProductVariantDto;

    // Kiểm tra nếu đã tồn tại ProductVariant với cùng productID, sizeID và color
    const exists = await this.checkIfExists(productId, sizeId, colorId);
    console.log(exists);

    if (exists) {
      throw new HttpException('Product variant with the same product, size, and color already exists', HttpStatus.BAD_REQUEST);
    }

    const newProductVariant = this.productVariantRepository.create(createProductVariantDto);
    return await this.productVariantRepository.save(newProductVariant);
  }

  async getProductVariantsByProductId(productId: number): Promise<ProductVariant[]> {
    const productVariants = await this.productVariantRepository.find({
      where: { productId: productId },
      select: ['id', 'size', 'color', 'quantity'],
    });

    if (!productVariants || productVariants.length === 0) {
      throw new NotFoundException(`No ProductVariants found for Product ID ${productId}`);
    }

    return productVariants;
  }
  async getProductVariantId(productId: number, sizeId: number, colorId: number): Promise<ProductVariant> {
    const productVariant = await this.productVariantRepository.findOne({
      where: {
        product: { id: productId }, 
        size: { id: sizeId },       
        color: { id: colorId },      
      },
      relations: ['product', 'size', 'color'], 
    });

    if (!productVariant) {
      throw new NotFoundException(`ProductVariant with productId ${productId}, sizeId ${sizeId}, and colorId ${colorId} not found.`);
    }

    return productVariant;
  }

  async findAll(): Promise<ProductVariant[]> {
    return this.productVariantRepository.find();
  }

  async findOne(id: number): Promise<ProductVariant> {
    const productVariant = await this.productVariantRepository.findOne({ where: { id } });
    if (!productVariant) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }
    return productVariant;
  }

  async update(id: number, updateProductVariantDto: UpdateProductVariantDto): Promise<ProductVariant> {
    await this.productVariantRepository.update(id, updateProductVariantDto);
    const updatedProductVariant = await this.findOne(id);
    return updatedProductVariant;
  }

  async remove(id: number): Promise<void> {
    const result = await this.productVariantRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }
  }
}
