import { User } from 'src/modules/user/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity({ name: 'order' })
export class Order {
  @PrimaryGeneratedColumn('increment', { name: 'id' })
  id: number;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @Column({ name: 'session', type: 'varchar', length: 255, default:''})
  session: string;

  @Column({ name: 'token', type: 'varchar', length: 255 , default:''})
  token: string;

  @Column({ name: 'status', type: 'varchar', length: 50 })
  status: string;

  @Column({ name: 'sub_total', type: 'float' })
  subTotal: number;

  @Column({ name: 'total_discount', type: 'float' })
  totalDiscount: number;

  @Column({ name: 'shipping_fee', type: 'float' , default: 0.0 })
  shippingFee: number;

  @Column({ name: 'grand_total', type: 'float' , default: 0.0})
  grandTotal: number;

  @Column({ name: 'first_name', type: 'varchar', length: 100  , default:''})
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 100 , default:''})
  middleName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 100 , default:''})
  lastName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20 , default:''})
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar', length: 100, default:'' })
  email: string;

  @Column({ name: 'line1', type: 'varchar', length: 255 , default:''})
  line1: string;

  @Column({ name: 'line2', type: 'varchar', length: 255, nullable: true })
  line2: string;

  @Column({ name: 'city', type: 'varchar', length: 100 , default:''})
  city: string;

  @Column({ name: 'province', type: 'varchar', length: 100 , default:''})
  province: string;

  @Column({ name: 'country', type: 'varchar', length: 100 , default:''})
  country: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'datetime',
  })
  createdAt: string;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'datetime',
  })
  updatedAt: string;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @BeforeInsert()
  setCreationDate() {
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  @BeforeUpdate()
  updateModificationDate() {
    this.updatedAt = new Date().toISOString();
  }
}
