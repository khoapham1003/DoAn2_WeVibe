import { ProductService } from 'src/modules/product/service/product.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from '../entities/productvariant.entity';
import { CreateProductVariantDto } from '../dto/create-productvariant.dto';
import { UpdateProductVariantDto } from '../dto/update-productvariant.dto';
import { Product } from 'src/modules/product/entities/product.entity';

@Injectable()
export class ProductVariantService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepository: Repository<ProductVariant>,
    private productService: ProductService,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async checkIfExists(
    productId: number,
    sizeId: number,
    colorId: number,
  ): Promise<ProductVariant | null> {
    return await this.productVariantRepository.findOne({
      where: {
        productId: productId,
        sizeId: sizeId,
        colorId: colorId,
      },
    });
  }

  async updateProductQuantity(productId: number): Promise<Product> {
    // Lấy tất cả các `ProductVariant` liên quan đến `Product`
    const variants = await this.productVariantRepository.find({
      where: { productId: productId },
    });

    // Tính tổng số lượng từ tất cả các `ProductVariant`
    const totalQuantity = variants.reduce(
      (sum, variant) => sum + variant.quantity,
      0,
    );

    // Cập nhật chỉ trường `quantity` của bảng `Product`
    const updatedProduct = await this.productService.updatevariant(productId, {
      quantity: totalQuantity,
    });

    return updatedProduct; // Trả về sản phẩm đã được cập nhật
  }

  async create(
    createProductVariantDto: CreateProductVariantDto,
  ): Promise<ProductVariant> {
    const { productId, sizeId, colorId, quantity } = createProductVariantDto;

    const existingVariant = await this.checkIfExists(
      productId,
      sizeId,
      colorId,
    );

    if (existingVariant) {
      existingVariant.quantity += quantity;
      await this.productVariantRepository.save(existingVariant);

      await this.updateProductQuantity(productId);
      console.log(existingVariant);
      return existingVariant;
    }

    // Nếu không tồn tại, tạo mới
    const newProductVariant = this.productVariantRepository.create(
      createProductVariantDto,
    );
    const savedVariant =
      await this.productVariantRepository.save(newProductVariant);

    // Cập nhật `quantity` trong bảng `Product`
    const product = await this.updateProductQuantity(productId);
    console.log(product);
    return savedVariant;
  }

  async getProductVariantsByProductId(
    productId: number,
  ): Promise<ProductVariant[]> {
    const productVariants = await this.productVariantRepository.find({
      where: { productId: productId },
      select: ['id', 'size', 'color', 'quantity'],
    });

    if (!productVariants || productVariants.length === 0) {
      throw new NotFoundException(
        `No ProductVariants found for Product ID ${productId}`,
      );
    }

    return productVariants;
  }
  async getProductVariantId(
    productId: number,
    sizeId: number,
    colorId: number,
  ): Promise<ProductVariant> {
    const productVariant = await this.productVariantRepository.findOne({
      where: {
        product: { id: productId },
        size: { id: sizeId },
        color: { id: colorId },
      },
      relations: ['product', 'size', 'color'],
    });

    if (!productVariant) {
      throw new NotFoundException(
        `ProductVariant with productId ${productId}, sizeId ${sizeId}, and colorId ${colorId} not found.`,
      );
    }

    return productVariant;
  }

  async findAll(): Promise<ProductVariant[]> {
    return this.productVariantRepository.find();
  }

  async findOne(id: number): Promise<ProductVariant> {
    const productVariant = await this.productVariantRepository.findOne({
      where: { id },
    });
    if (!productVariant) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }
    return productVariant;
  }

  async update(
    id: number,
    updateProductVariantDto: UpdateProductVariantDto,
  ): Promise<ProductVariant> {
    await this.productVariantRepository.update(id, updateProductVariantDto);
    const updatedProductVariant = await this.findOne(id);
    return updatedProductVariant;
  }

  async remove(id: number): Promise<void> {
    // Tìm `ProductVariant` để lấy thông tin
    const variant = await this.productVariantRepository.findOne({
      where: { id },
    });

    if (!variant) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }

    // Lưu `productId` trước khi xóa
    const productId = variant.productId;

    // Xóa `ProductVariant`
    const result = await this.productVariantRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`ProductVariant with ID ${id} not found`);
    }

    // Cập nhật lại `quantity` của `Product`
    await this.updateProductQuantity(productId);
  }
}
