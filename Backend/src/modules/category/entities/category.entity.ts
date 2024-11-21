import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'parent_id', type: 'int', nullable: true })
  parentId: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 255 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  content: string;

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

  @ManyToOne(() => Category, category => category.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @BeforeInsert()
  setCreationDate() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  @BeforeUpdate()
  updateModificationDate() {
    this.updatedAt = new Date().toISOString();
  }
}
