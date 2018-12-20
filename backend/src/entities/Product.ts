import { EntityError } from '../types';
import { EntityNotValidError, DuplicateEntityError, EntityNotFoundError } from '../utils';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './Category';
import { Length, IsNumber, Min, Max, Allow, ValidateNested, MaxLength } from 'class-validator';

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
    cascade: false,
    onDelete: 'CASCADE'
  })
  @Allow()
  @JoinTable()
  categories: Category[];
}

export class ProductNotFoundError extends EntityNotFoundError<Product> {
  constructor() {
    super(Product);
  }
}

export class ProductNotValidError extends EntityNotValidError<Product> {
  constructor(errors: EntityError) {
    super(Product, errors);
  }
}

export class DuplicateProductError extends DuplicateEntityError<Product> {
  constructor() {
    super(Product);
  }
}
