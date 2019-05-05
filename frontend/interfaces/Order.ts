import { OrderProduct, Table } from '.';
import { OrderState } from '../types';

export interface Order {
  id?: string;
  customerId?: string;
  table: Table;
  products: OrderProduct[];
  comment: string;
  state?: OrderState;
  placed?: Date;
  accepted?: Date;
  declined?: Date;
  finished?: Date;
}
