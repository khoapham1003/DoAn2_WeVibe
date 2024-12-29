import { ProductVariantService } from './../../productvariant/service/productvariant.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductVariant } from 'src/modules/productvariant/entities/productvariant.entity';
import { CartItem } from '../entities/cartitem.entity';
import { CreateCartItemDto } from '../dto/create-cartitem.dto';
import { UpdateCartItemDto } from '../dto/update-cartitem.dto';
import { Cart } from 'src/modules/cart/entities/cart.entity';

@Injectable()
export class CartItemService {
  constructor(
    private readonly productVariantService: ProductVariantService,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(ProductVariant)
    private readonly productVariantRepository: Repository<ProductVariant>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async createCartItem(
    createCartItemDto: CreateCartItemDto,
  ): Promise<CartItem> {
    const { cartID, colorId, sizeId, productId, quantity, price } = createCartItemDto;

    const productVariant = await this.productVariantService.getProductVariantId(
      productId,
      sizeId,
      colorId,
    );
    const productVID = productVariant.id;

    if (!productVariant) {
      throw new NotFoundException(
        `ProductVariant with ID ${productVID} not found.`,
      );
    }

    if (productVariant.quantity < quantity) {
      throw new BadRequestException(
        'Số lượng yêu cầu vượt quá số lượng tồn kho.',
      );
    }

    const cart = await this.cartRepository.findOne({ where: { id: cartID } });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartID} not found.`);
    }

    // Update the cart status if it is 'empty'
    if (cart.status === 'empty') {
      cart.status = 'active';
      await this.cartRepository.save(cart); // Save the updated cart status
    }

    const discount = productVariant.product.discount || 0;
    const finalPrice = price;

    const existingCartItem = await this.cartItemRepository.findOne({
      where: { cartID, productVID, active: true },
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity; // Increment the quantity
      existingCartItem.price += finalPrice; // Update the price if necessary

      // Save the updated CartItem
      return await this.cartItemRepository.save(existingCartItem);
    } else {
      // If it does not exist, create a new CartItem
      const cartItem = this.cartItemRepository.create({
        cartID,
        productVID,
        price: finalPrice,
        discount: discount,
        quantity: quantity,
        active: true,
      });

      // Save the new CartItem
      return await this.cartItemRepository.save(cartItem);
    }
  }
  async findAll(): Promise<CartItem[]> {
    return await this.cartItemRepository.find();
  }

  async findOne(id: number): Promise<CartItem> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID ${id} not found.`);
    }
    return cartItem;
  }
  async update(
    id: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<CartItem | { message: string }> {
    const cartItem = await this.cartItemRepository.findOne({ where: { id } });

    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID ${id} not found.`);
    }

    if (updateCartItemDto.quantity !== undefined) {
      const newQuantity = updateCartItemDto.quantity;
      if (newQuantity < 0) {
        throw new BadRequestException('Quantity cannot be negative.');
      }
      const productVariant = await this.productVariantRepository.findOne({
        where: { id: cartItem.productVID },
        relations: ['product'],
      });

      if (!productVariant) {
        throw new NotFoundException(
          `ProductVariant with ID ${cartItem.productVID} not found.`,
        );
      }

      if (newQuantity > productVariant.quantity) {
        throw new BadRequestException(
          'Requested quantity exceeds available stock.',
        );
      }

      if (newQuantity === 0) {
        // Delete the CartItem if the new quantity is zero
        await this.cartItemRepository.delete(id);
        return {
          message:
            'CartItem has been removed because the quantity reached zero.',
        };
      }

      // Update the quantity and recalculate the price
      cartItem.quantity = newQuantity;
      cartItem.price =
        productVariant.product.price *
        (1 - (productVariant.product.discount || 0));
    }

    // Save the updated CartItem
    return this.cartItemRepository.save(cartItem);
  }

  async remove(id: number): Promise<void> {
    const cartItem = await this.findOne(id);
    if (!cartItem) {
      throw new NotFoundException(`CartItem with ID ${id} not found.`);
    }

    const { id: cartID } = cartItem.cart; // Lấy cartID từ cartItem

    // Tìm Cart theo cartID
    const cart = await this.cartRepository.findOne({ where: { id: cartID } });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartID} not found.`);
    }

    if (cart.status === 'active') {
      cart.status = 'empty';
      await this.cartRepository.save(cart); // Lưu lại giỏ hàng sau khi cập nhật trạng thái
    }

    await this.cartItemRepository.remove(cartItem);
  }

  async findCartData(cartID: number): Promise<CartItem[]> {
    const cartItems = await this.cartItemRepository.find({
      where: { cartID, active: true },
      relations: ['productVariant'],
    });

    if (!cartItems || cartItems.length === 0) {
      throw new NotFoundException(`No CartItems found for CartID ${cartID}`);
    }

    return cartItems;
  }
}
