import { Entity, PrimaryGeneratedColumn, Column, MinKey } from 'typeorm';
import { Length } from 'class-validator';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @Length(5, 50)
  name: string;

  @Length(5, 255)
  @Column('text')
  image: string;
}
