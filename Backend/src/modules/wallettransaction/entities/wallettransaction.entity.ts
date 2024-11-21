import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
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
  
  @Entity({ name: 'wallet_transaction' })
  export class WalletTransaction {
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;
  
    @Column({ name: 'wallet_id', type: 'int' })
    walletId: number;
  
    @Column({ name: 'transaction_id', type: 'int' })
    transactionId: number;
  
    @Column({ name: 'amount', type: 'float' })
    amount: number;
  
    @Column({ name: 'hash', type: 'varchar', length: 255 }) 
    hash: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
  
    @ManyToOne(() => Wallet, (wallet) => wallet.id)
    @JoinColumn({ name: 'wallet_id' })
    wallet: Wallet;
  
    @ManyToOne(() => Transaction, (transaction) => transaction.id)
    @JoinColumn({ name: 'transaction_id' })
    transaction: Transaction;
  
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
  