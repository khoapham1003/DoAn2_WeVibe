import { Injectable } from '@nestjs/common';
import { CreateCartDto } from '../dto/create-cart.dto';
import { UpdateCartDto } from '../dto/update-cart.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from '../entities/cart.entity';
import { DeepPartial, Repository } from 'typeorm';
import { TYPE_STATUS } from 'src/shared/constants/status.const';
import { CartItemService } from 'src/modules/cart-item/service/cart-item.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private cartItemService: CartItemService,
  ) {}

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const cart = this.cartRepository.create(
      createCartDto as unknown as DeepPartial<Cart>,
    );
    let totalPrice = 0;
    const savedCart = await this.cartRepository.save(cart);

    const cartItems = await this.cartItemService.getItemOfCart(
      savedCart.mCartId,
    );
    if (cartItems.length > 0) {
      totalPrice = cartItems.reduce(
        (sum, item) => sum + item.mQuantity * item.mProductId.mProductPrice,
        0,
      );
    }

    savedCart.mTotalAmount = totalPrice;
    await this.cartRepository.save(savedCart);

    return savedCart;
  }

  findAll(): Promise<Cart[]> {
    return this.cartRepository.find();
  }

  async findOne(mCartId: number): Promise<Cart> {
    const savedCart = await this.cartRepository.findOneBy({ mCartId });
    if (!savedCart) {
      throw new Error('Cart not found');
    }
    let totalPrice = 0;
    const cartItems = await this.cartItemService.getItemOfCart(mCartId);
    if (cartItems.length > 0) {
      totalPrice = cartItems.reduce(
        (sum, item) => sum + item.mQuantity * item.mProductId.mProductPrice,
        0,
      );
    }
    savedCart.mTotalAmount = totalPrice;
    console.log(cartItems.map(item => item.mProductId));
    await this.cartRepository.save(savedCart);
    return savedCart;
  }

  async update(mCartId: number, updateCartDto: UpdateCartDto): Promise<void> {
    await this.cartRepository.update(
      mCartId,
      updateCartDto as unknown as DeepPartial<Cart>,
    );
  }

  async remove(mCartId: number): Promise<void> {
    const cart = await this.findOne(mCartId);
    if (cart) {
      cart.mStatus = TYPE_STATUS.DELETE;
      await this.update(mCartId, this.toUpdateCartDto(cart));
    }
  }

  toUpdateCartDto(cart: Cart): UpdateCartDto {
    const cartDto = new UpdateCartDto();
    cartDto.mUserId = cart.mUserId.mUserId;
    cartDto.mStatus = cart.mStatus;
    cartDto.mModified = cart.mModified;
    return cartDto;
  }
}
