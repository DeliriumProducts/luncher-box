import { Product } from '.';

export interface Order {
  tableId: string;
  products: Product[];
  comment: string;
}
