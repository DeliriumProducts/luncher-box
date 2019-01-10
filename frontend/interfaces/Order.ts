import { Product } from '.';

export interface Order {
  products: Product[];
  comment: string;
}
