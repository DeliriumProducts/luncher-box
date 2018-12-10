import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from 'typeorm';
import { Category } from './Category';
import { Length, IsNumber, Min, Max } from 'class-validator';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 50)
  name: string;

  @Column('text')
  @Length(5, 255)
  description: string;

  @Column('text')
  @Length(5, 255)
  image: string;

  @Column('double')
  @IsNumber()
  @Min(0)
  @Max(1000)
  price: number;

  @ManyToMany(type => Category, category => category.products, {
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinTable()
  categories: Category[];
}
