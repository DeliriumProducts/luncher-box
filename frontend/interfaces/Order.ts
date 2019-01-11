import { Product } from '.';

export interface Order {
  id: number;
  table: string;
  products: Product[];
  comment: string;
}
