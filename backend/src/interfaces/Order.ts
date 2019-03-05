import { OrderState, EntityError } from '../types';
import { Product } from '../entities';
import { EntityNotValidError } from '../utils';

export interface Order {
  id: number;
  comment?: string;
  products: Partial<Product>[];
  table: string;
  state: OrderState;
  customerId?: string;
}

export class OrderNotValidError extends EntityNotValidError<Order> {
  constructor(errors: EntityError) {
    super('Order', errors);
  }
}
