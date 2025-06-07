import { Color } from 'src/modules/color/entities/color.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Size } from 'src/modules/size/entities/size.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'product_variant' })
export class ProductVariant {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'productId', type: 'int', nullable: true })
  productId: number;

  @Column({ name: 'sizeId', type: 'int', nullable: true })
  sizeId: number;

  @Column({ name: 'colorId', type: 'int', nullable: true })
  colorId: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Product, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  product: Product;

  @ManyToOne(() => Size, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  size: Size;

  @ManyToOne(() => Color, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  color: Color;
}
