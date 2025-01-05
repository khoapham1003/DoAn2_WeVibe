import { Color } from 'src/modules/color/entities/color.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Size } from 'src/modules/size/entities/size.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'product_variant' })
export class ProductVariant {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'productId', type: 'int' })
  productId: number;

  @Column({ name: 'sizeId', type: 'int' })
  sizeId: number;

  @Column({ name: 'colorId', type: 'int' })
  colorId: number;

  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ManyToOne(() => Size, { eager: true })
  size: Size;

  @ManyToOne(() => Color, { eager: true })
  color: Color;
}
