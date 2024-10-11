import { Injectable } from '@nestjs/common';
import { CreateCartItemDto } from '../dto/create-cart-item.dto';
import { UpdateCartItemDto } from '../dto/update-cart-item.dto';
import { CartItem } from '../entities/cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { TYPE_STATUS } from 'src/shared/constants/status.const';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItem)
    private cartItemRepository: Repository<CartItem>,
  ) {}

  create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const cartItem = this.cartItemRepository.create(
      createCartItemDto as unknown as DeepPartial<CartItem>,
    );
    return this.cartItemRepository.save(cartItem);
  }

  findAll(): Promise<CartItem[]> {
    return this.cartItemRepository.find();
  }

  findOne(mCartItemId: number): Promise<CartItem> {
    return this.cartItemRepository.findOneBy({ mCartItemId });
  }

  async update(
    mCartItemId: number,
    updateCartItemDto: UpdateCartItemDto,
  ): Promise<void> {
    await this.cartItemRepository.update(
      mCartItemId,
      updateCartItemDto as unknown as Partial<CartItem>,
    );
  }

  async remove(mCartItemId: number): Promise<void> {
    const cartItem = await this.findOne(mCartItemId);
    if (cartItem) {
      cartItem.mStatus = TYPE_STATUS.DELETE;
      await this.update(mCartItemId, this.toUpdateCartItemDto(cartItem));
    }
  }

  toUpdateCartItemDto(cartItem: CartItem): UpdateCartItemDto {
    const cartItemDto = new UpdateCartItemDto();
    cartItemDto.mCartId = cartItem.mCartId.mCartId;
    cartItemDto.mModified = cartItem.mModified;
    cartItemDto.mProductId = cartItem.mProductId.mProductId;
    cartItemDto.mQuantity = cartItem.mQuantity;
    cartItemDto.mStatus = cartItem.mStatus;
    return cartItemDto;
  }

  getItemOfCart(cartId: number): Promise<CartItem[]> {
    return this.cartItemRepository
      .createQueryBuilder('cart-item')
      .innerJoinAndSelect('cart-item.mProductId', 'product')
      .where('cart-item.m_cart_id = :cartId', { cartId: cartId })
      .getMany();
  }
}
