import { Currency } from 'src/modules/currency/entities/currency.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ name: 'wallet' })
export class Wallet {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'wallet_address', type: 'varchar', length: 255 })
  walletAddress: string;

  @Column({ name: 'currency_id', type: 'int' })
  currencyId: number;

  @Column({ name: 'balance', type: 'float' })
  balance: number;

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

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Currency, { eager: true })
  @JoinColumn({ name: 'currency_id' })
  currency: Currency;

  @BeforeInsert()
  setCreationDate() {
    const now = new Date().toISOString();
    this.createdAt = now;
  }

  @BeforeUpdate()
  updateModificationDate() {
    this.updatedAt = new Date().toISOString();
  }
}
