// cartitem.factory.ts
import { CartItem } from '../entities/cartitem.entity';
import { ProductVariant } from 'src/modules/productvariant/entities/productvariant.entity';

export class CartItemFactory {
  static createFromVariant(
    cartID: number,
    variant: ProductVariant,
    quantity: number,
  ): CartItem {
    const discount = variant.product?.discount || 0;
    const price = variant.product?.price || 0;
    const finalPrice = price * quantity * (1 - discount);

    const cartItem = new CartItem();
    cartItem.cartID = cartID;
    cartItem.productVID = variant.id;
    cartItem.price = finalPrice;
    cartItem.discount = discount;
    cartItem.quantity = quantity;
    cartItem.active = true;

    return cartItem;
  }
}
