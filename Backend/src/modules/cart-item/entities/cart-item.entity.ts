import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Product } from 'src/modules/product/entities/product.entity';

@Entity({ name: 'cart_item' })
export class CartItem {
  @PrimaryGeneratedColumn('increment', { name: 'm_cart_item_id' })
  mCartItemId: number;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'm_cart_id' })
  mCartId: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'm_product_id' })
  mProductId: Product;

  @Column({ name: 'm_quantity' })
  mQuantity: number;

  @Column({ name: 'm_status' })
  mStatus: string;

  @Column({
    name: 'm_created',
    type: 'timestamp',
    transformer: {
      to: (value: string) => (value ? new Date(value) : null),
      from: (value: Date) => (value ? value.toISOString() : null),
    },
  })
  mCreated: string;

  @Column({
    name: 'm_modified',
    type: 'timestamp',
    transformer: {
      to: (value: string) => (value ? new Date(value) : null),
      from: (value: Date) => (value ? value.toISOString() : null),
    },
  })
  mModified: string;

  @BeforeInsert()
  setCreationDate() {
    this.mCreated = new Date().toISOString();
    this.mModified = new Date().toISOString();
  }

  @BeforeUpdate()
  updateModificationDate() {
    this.mModified = new Date().toISOString();
  }
}
