import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'm_user_id' })
  UserId: number;

  @Column({ name: 'first_name', type: 'varchar', length: 50 })
  firstName: string;

  @Column({ name: 'middle_name', type: 'varchar', length: 50, nullable: true })
  middleName: string;

  @Column({ name: 'last_name', type: 'varchar', length: 50 })
  lastName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string;

  @Column({ name: 'email', type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ name: 'admin', type: 'boolean', default: false })
  admin: boolean;

  @Column({ name: 'guest', type: 'boolean', default: false })
  guest: boolean;

  @Column({
    name: 'registered_at',
    type: 'timestamp',
    transformer: {
      to: (value: string) => (value ? new Date(value) : null),
      from: (value: Date) => (value ? value.toISOString() : null),
    },
  })
  registeredAt: string;

  @Column({
    name: 'last_login',
    type: 'timestamp',
    nullable: true,
    transformer: {
      to: (value: string) => (value ? new Date(value) : null),
      from: (value: Date) => (value ? value.toISOString() : null),
    },
  })
  lastLogin: string;

  @BeforeInsert()
  setRegistrationDate() {
     this.registeredAt = new Date().toISOString();
    this.lastLogin = new Date().toISOString();
  }

  @BeforeUpdate()
  updateLastLoginDate() {
      this.lastLogin = new Date().toISOString();
  }
}
