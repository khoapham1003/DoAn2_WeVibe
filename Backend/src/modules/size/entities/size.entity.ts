import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'size' })
export class Size {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'int' })
  size: number;
}
