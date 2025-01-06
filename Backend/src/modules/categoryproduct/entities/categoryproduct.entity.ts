import { Category } from 'src/modules/category/entities/category.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'category_product' })
export class CategoryProduct {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'categoryId', type: 'int', nullable: true })
  categoryId: number;

  @Column({ name: 'productId', type: 'int', nullable: true })
  productId: number;

  @ManyToOne(() => Category, (category) => category.categoryProducts, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => Product, (product) => product.categoryProducts, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  product: Product;
}
