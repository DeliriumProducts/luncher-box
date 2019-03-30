import { Product } from '.';

export interface Order {
  id?: string;
  table: string;
  products: Product[];
  comment: string;
  state?: number;
}
