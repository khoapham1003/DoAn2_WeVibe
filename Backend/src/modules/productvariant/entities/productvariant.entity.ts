import { Color } from 'src/modules/color/entities/color.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Size } from 'src/modules/size/entities/size.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'product_variant' })
export class ProductVariant {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @Column({ name: 'size_id', type: 'int' })
  sizeId: number;

  @Column({ name: 'color_id', type: 'int' })
  colorId: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Product, { eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Size, { eager: true })
  @JoinColumn({ name: 'size_id' })
  size: Size;

  @ManyToOne(() => Color, { eager: true })
  @JoinColumn({ name: 'color_id' })
  color: Color;
}
