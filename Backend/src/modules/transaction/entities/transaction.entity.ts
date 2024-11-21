import { Order } from 'src/modules/order/entities/order.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    BeforeUpdate,
  } from 'typeorm';
  
  @Entity({ name: 'transaction' })
  export class Transaction {
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;
  
    @Column({ name: 'order_id', type: 'int' })
    orderId: number;
  
    @Column({ name: 'amount', type: 'float' })
    amount: number;
  
    @Column({ name: 'payment_method_type', type: 'varchar', length: 50 })
    paymentMethodType: string;
  
    @Column({ name: 'status', type: 'varchar', length: 50 })
    status: string;
  
    @Column({ name: 'payment_details', type: 'text' })
    paymentDetails: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
  
    @ManyToOne(() => Order, { eager: true })
    @JoinColumn({ name: 'order_id' })
    order: Order;
  
    @BeforeInsert()
    setCreationDate() {
      const now = new Date();
      this.createdAt = now;
      this.updatedAt = now;
    }
  
    @BeforeUpdate()
    updateModificationDate() {
      this.updatedAt = new Date();
    }
  }
  