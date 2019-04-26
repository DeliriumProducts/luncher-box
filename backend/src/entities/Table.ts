import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Order } from '.';
import { EntityError } from '../types';
import { EntityNotFoundError, EntityNotValidError } from '../utils';

@Entity()
export class Table {
  @PrimaryColumn()
  id: string;

  @Column()
  isTaken: boolean;

  @OneToMany(() => Order, o => o.table)
  order: Order[];
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

export class DuplicateTableError extends EntityNotValidError<Table> {
  constructor(errors: EntityError) {
    super('Table', errors);
  }
}
