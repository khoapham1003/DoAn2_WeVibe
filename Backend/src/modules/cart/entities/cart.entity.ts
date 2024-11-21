import { User } from 'src/modules/user/entities/user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn
  } from 'typeorm';
  
  @Entity({ name: 'cart' })
  export class Cart {
    @PrimaryGeneratedColumn('increment', { name: 'id' })
    id: number;
  
    @Column({ name: 'user_id', type: 'int' })
    userId: number;
      
    @Column({ name: 'status', type: 'varchar', length: 50 })
    status: string;
  
    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: Date;
  
    @ManyToOne(() => User, { eager: true }) 
    @JoinColumn({ name: 'user_id' })
    user: User;
  }
  