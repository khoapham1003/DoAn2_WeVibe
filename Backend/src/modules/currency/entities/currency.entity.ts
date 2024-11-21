import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ name: 'currency' })
export class Currency {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'currency_code', type: 'varchar', length: 3 })
  currencyCode: string;

  @Column({ name: 'currency_name', type: 'varchar', length: 100 })
  currencyName: string;

  @Column({ name: 'exchange_rate', type: 'float' })
  exchangeRate: number;

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
