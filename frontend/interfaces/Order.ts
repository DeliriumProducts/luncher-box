import { Product } from '.';
import { OrderState } from '../types';

export interface Order {
  id?: string;
  customerId?: string;
  table: string;
  products: Product[];
  comment: string;
  state?: OrderState;
  placed?: Date;
  accepted?: Date;
  declined?: Date;
  finished?: Date;
}
