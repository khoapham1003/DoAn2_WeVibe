import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeUpdate,
  BeforeInsert,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('increment', { name: 'm_user_id' })
  mUserId: number;

  @Column({ name: 'm_name', type: 'varchar', length: 100 })
  mName: string;

  @Column({ name: 'm_email', type: 'varchar', length: 100, unique: true })
  mEmail: string;

  @Column({ name: 'm_phone', type: 'varchar', length: 20, nullable: true })
  mPhone: string;

  @Column({ name: 'm_gender', type: 'varchar', length: 10, nullable: true })
  mGender: boolean;

  @Column({ name: 'm_address', type: 'varchar', length: 200, nullable: true })
  mAddress: string;

  @Column({ name: 'm_password', type: 'varchar', length: 100 })
  mPassword: string;

  @Column({ name: 'm_status' })
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
