import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity({ name: 'admin' })
export class Admin {
  @PrimaryGeneratedColumn({ name: 'm_admin_id' })
  mAdminId: number;

  @Column({ name: 'm_name', type: 'varchar', length: 100 })
  mName: string;

  @Column({ name: 'm_email', type: 'varchar', length: 100, unique: true })
  mEmail: string;

  @Column({ name: 'm_phone', type: 'varchar', length: 20, nullable: true })
  mPhone: string;

  @Column({ name: 'm_password', type: 'varchar', length: 100 })
  mPassword: string;

  @Column({ name: 'm_status', type: 'varchar', length: 50 })
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
