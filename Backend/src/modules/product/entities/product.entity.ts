import { Type } from 'src/modules/type/entities/type.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('increment', { name: 'm_product_id' })
  mProductId: number;

  @Column({ name: 'm_product_name', type: 'varchar', length: 100 })
  mProductName: string;

  @Column({ name: 'm_product_price', type: 'int' })
  mProductPrice: number;

  @Column({ name: 'm_product_description', type: 'text' })
  mProductDescription: string;

  @Column({ name: 'm_product_stock_quantity', type: 'int' })
  mProductStockQuantity: number;

  @Column({ name: 'm_product_image', type: 'varchar', length: 200 })
  mProductImage: string;

  @ManyToOne(() => Type)
  @JoinColumn({ name: 'm_type_id' })
  mTypeId: Type;

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
