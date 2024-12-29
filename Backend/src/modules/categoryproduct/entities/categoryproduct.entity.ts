import { Category } from 'src/modules/category/entities/category.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'category_product' })
export class CategoryProduct {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'category_id', type: 'int' })
  categoryId: number;

  @Column({ name: 'product_id', type: 'int' })
  productId: number;

  @ManyToOne(() => Category, category => category.categoryProducts)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Product, product => product.categoryProducts)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
