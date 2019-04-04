import { Product } from '.';
import { OrderState } from '../types';

export interface Order {
  id?: string;
  table: string;
  products: Product[];
  comment: string;
  state?: OrderState;
}
