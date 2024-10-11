import { User } from 'src/modules/user/entities/user.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'm_order' })
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'm_order_id' })
  mOrderId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'm_user_id' })
  mUser: User;

  @Column({ name: 'm_status', type: 'varchar', length: 20 })
  mStatus: string;

  @Column({ name: 'm_total_amount', type: 'decimal', precision: 10, scale: 2 })
  mTotalAmount: number;

  @Column({ name: 'm_payment_method', type: 'varchar', length: 50 })
  mPaymentMethod: string;

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
