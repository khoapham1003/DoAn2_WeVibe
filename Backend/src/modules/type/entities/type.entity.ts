import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'type' })
export class Type {
  @PrimaryGeneratedColumn('increment', { name: 'm_type_id' })
  mTypeId: number;

  @Column({ name: 'm_type_name', type: 'nvarchar', length: 100 })
  mTypeName: string;

  @Column({ name: 'm_description', type: 'text' })
  mDescription: string;

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
