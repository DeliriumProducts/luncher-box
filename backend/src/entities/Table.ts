import { IsBoolean, IsString } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from '.';
import { EntityError } from '../types';
import { EntityNotFoundError, EntityNotValidError } from '../utils';

@Entity()
export class Table {
  @PrimaryGeneratedColumn()
  id: string;

  @Column('text')
  @IsString()
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
