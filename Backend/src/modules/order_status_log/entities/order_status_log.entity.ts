import { Order } from 'src/modules/order/entities/order.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'order_status_log' })
export class OrderStatusLog {
  @PrimaryGeneratedColumn('increment', { name: 'm_order_status_log_id' })
  mOrderStatusLogId: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'm_order_id' })
  mOrderId: Order;

  @Column({ name: 'm_status', type: 'varchar', length: 20 })
  mStatus: string;

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

  @Column({ name: 'm_comments', type: 'text', nullable: true })
  mComments: string;

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
