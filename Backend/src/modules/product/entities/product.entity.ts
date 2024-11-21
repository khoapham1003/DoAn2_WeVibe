import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'boolean' })
  shop: boolean;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
    transformer: {
      to: (value: string) => (value ? new Date(value) : null),
      from: (value: Date) => (value ? value.toISOString() : null),
    },
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
    transformer: {
      to: (value: string) => (value ? new Date(value) : null),
      from: (value: Date) => (value ? value.toISOString() : null),
    },
  })
  updatedAt: string;

  @Column({ type: 'float', nullable: true })
  discount: number;

  @Column({ name: 'starts_at', type: 'datetime' })
  startsAt: Date;

  @Column({ name: 'ends_at', type: 'datetime' })
  endsAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  picture: string;

  @BeforeInsert()
  setCreationDate() {
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
    this.startsAt = new Date(now);
    this.endsAt = new Date(now);
  }

  @BeforeUpdate()
  updateModificationDate() {
    this.updatedAt = new Date().toISOString();
  }
}
