import { Product } from './Product';
import { Entity, PrimaryGeneratedColumn, Column, MinKey, ManyToMany } from 'typeorm';
import { Length, IsEmail, Allow, IsDefined } from 'class-validator';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  @IsDefined({
    groups: ['creatingProducts']
  })
  id: number;

  @Column('text')
  @Length(4, 50, {
    groups: ['creatingCategories']
  })
  name: string;

  @Column('text')
  @Length(5, 255, {
    groups: ['creatingCategories']
  })
  image: string;

  @ManyToMany(() => Product, product => product.categories)
  products: Product[];
}
