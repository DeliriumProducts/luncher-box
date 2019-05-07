import { IsBoolean, IsString, Length } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Order } from '.';
import { EntityError } from '../types';
import { EntityNotFoundError, EntityNotValidError, DuplicateEntityError } from '../utils';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ length: 255, unique: true })
  @IsString()
  @Length(2, 50)
  name: string;

  @Column()
  @IsBoolean()
  isTaken: boolean;

  @OneToMany(() => Order, o => o.table)
  orders: Order[];
}

export class TableNotFoundError extends EntityNotFoundError<Table> {
  constructor() {
    super('Table');
  }
}

export class TableNotValidError extends EntityNotValidError<Table> {
  constructor(errors: EntityError) {
    super('Table', errors);
  }
}

export class DuplicateTableError extends DuplicateEntityError<Table> {
  constructor() {
    super('Table');
  }
}
