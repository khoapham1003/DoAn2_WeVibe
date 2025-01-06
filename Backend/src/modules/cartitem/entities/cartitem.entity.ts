import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { ProductVariant } from 'src/modules/productvariant/entities/productvariant.entity';

@Entity({ name: 'cart_item' })
export class CartItem {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'productVariantId', type: 'int', nullable: true })
  productVID: number;

  @Column({ name: 'cart_id', type: 'int' })
  cartID: number;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'discount', type: 'float' })
  discount: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: string;

  @ManyToOne(() => ProductVariant, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  productVariant: ProductVariant;

  @ManyToOne(() => Cart, { eager: true })
  @JoinColumn({ name: 'cart_id' })
  cart: Cart;

  @BeforeInsert()
  setCreationDate() {
    const now = new Date().toISOString();
    this.createdAt = now;
  }

  @BeforeUpdate()
  updateModificationDate() {
    this.updatedAt = new Date().toISOString();
  }
}
