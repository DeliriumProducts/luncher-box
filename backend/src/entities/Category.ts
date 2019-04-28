import { IsUrl, Length } from 'class-validator';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityError } from '../types';
import { EntityNotFoundError, EntityNotValidError } from '../utils';
import { Product } from './Product';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  @Length(3, 50)
  name: string;

  @Column('text')
  @IsUrl()
  @Length(5, 255)
  image: string;

  @ManyToMany(() => Product, p => p.categories)
  products: Product[];
}

export class CategoryNotFoundError extends EntityNotFoundError<Category> {
  constructor() {
    super('Category');
  }
}

export class CategoryNotValidError extends EntityNotValidError<Category> {
  constructor(errors: EntityError) {
    super('Category', errors);
  }
}
