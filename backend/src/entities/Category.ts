import { EntityError } from '../types';
import { EntityNotValidError, EntityNotFoundError } from '../utils';
import { Product } from './Product';
import { Entity, PrimaryGeneratedColumn, Column, MinKey, ManyToMany } from 'typeorm';
import { Length } from 'class-validator';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @Length(4, 50)
  name: string;

  @Column('text')
  @Length(5, 255)
  image: string;

  @ManyToMany(() => Product, product => product.categories)
  products: Product[];
}

export class CategoryNotFoundError extends EntityNotFoundError<Category> {
  constructor() {
    super(Category);
  }
}

export class CategoryNotValidError extends EntityNotValidError<Category> {
  constructor(errors: EntityError) {
    super(Category, errors);
  }
}
