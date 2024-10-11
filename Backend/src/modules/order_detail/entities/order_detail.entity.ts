import { Order } from 'src/modules/order/entities/order.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order_detail' })
export class OrderDetail {
  @PrimaryGeneratedColumn('increment', { name: 'm_order_detail_id' })
  mOrderDetailId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'm_order_id' })
  mOrderId: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'm_product_id' })
  mProductId: Product;

  @Column({ name: 'm_quantity', type: 'int' })
  mQuantity: number;

  @Column({ name: 'm_price', type: 'decimal', precision: 10, scale: 2 })
  mPrice: number;

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
