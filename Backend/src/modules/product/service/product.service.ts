import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(
      createProductDto as unknown as DeepPartial<Product>,
    );
    return this.productRepository.save(product);
  }

  findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  findOne(mProductId: number): Promise<Product> {
    return this.productRepository.findOneBy({ mProductId });
  }

  findAllType(mTypeName: string): Promise<Product[]> {
    return this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.mTypeId', 'type')
      .where('type.mTypeName = :mTypeName', { mTypeName })
      .getMany();
  }

  async update(
    mProductId: number,
    updateProductDto: UpdateProductDto,
  ): Promise<void> {
    await this.productRepository.update(
      mProductId,
      updateProductDto as unknown as DeepPartial<Product>,
    );
  }

  async remove(mProductId: number): Promise<void> {
    const product = await this.findOne(mProductId);
    if (product) {
      product.mStatus = TYPE_STATUS.DELETE;
      await this.update(mProductId, this.toUpdateProductDto(product));
    }
  }

  toUpdateProductDto(product: Product): UpdateProductDto {
    const updateProductDto = new UpdateProductDto();
    updateProductDto.mProductName = product.mProductName;
    updateProductDto.mProductPrice = product.mProductPrice;
    updateProductDto.mProductDescription = product.mProductDescription;
    updateProductDto.mProductStockQuantity = product.mProductStockQuantity;
    updateProductDto.mProductImage = product.mProductImage;
    updateProductDto.mTypeId = product.mTypeId.mTypeId;
    updateProductDto.mStatus = product.mStatus;
    updateProductDto.mModified = product.mModified;
    return updateProductDto;
  }
}
