import { OrderState, EntityError } from '../types';
import { Product } from '../entities';
import { EntityNotValidError, EntityNotFoundError } from '../utils';

export interface Order {
  id: string;
  comment?: string;
  products: Partial<Product>[];
  table: string;
  state: OrderState;
  customerId?: string;
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
