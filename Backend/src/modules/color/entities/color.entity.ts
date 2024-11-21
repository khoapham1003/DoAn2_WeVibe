import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'color' })
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 7 })
  hex: string;
}
