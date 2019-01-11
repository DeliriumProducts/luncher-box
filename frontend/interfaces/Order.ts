import { Product } from '.';

export interface Order {
  id: number;
  tableId: string;
  products: Product[];
  comment: string;
}
