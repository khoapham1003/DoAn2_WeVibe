import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Order } from 'src/modules/order/entities/order.entity';
import { ProductVariant } from 'src/modules/productvariant/entities/productvariant.entity';

@Entity({ name: 'order_item' })
export class OrderItem {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'productVariantId', type: 'int', nullable: true })
  productVID: number;

  @Column({ name: 'order_id', type: 'int' })
  orderID: number;

  @Column({ name: 'price', type: 'float' })
  price: number;

  @Column({ name: 'discount', type: 'float' })
  discount: number;

  @Column({ name: 'quantity', type: 'int' })
  quantity: number;

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
    onDelete: 'SET NULL' 
  })
  productVariant: ProductVariant;

  @ManyToOne(() => Order, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @BeforeInsert()
  setCreationDate() {
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  updateModificationDate() {
    this.updatedAt = new Date().toISOString();
  }
}
