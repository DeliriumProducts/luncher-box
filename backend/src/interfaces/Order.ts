import { Product } from '../entities';
import { EntityError, OrderState } from '../types';
import { EntityNotFoundError, EntityNotValidError } from '../utils';

export interface Order {
  id: string;
  customerId: string;
  table: string;
  products: Product[];
  comment: string;
  state?: OrderState;
  placed?: Date;
  accepted?: Date;
  declined?: Date;
  finished?: Date;
}

export class OrderNotFoundError extends EntityNotFoundError<Product> {
  constructor() {
    super('Order');
  }
}

export class OrderNotValidError extends EntityNotValidError<Order> {
  constructor(errors: EntityError) {
    super('Order', errors);
  }
}
