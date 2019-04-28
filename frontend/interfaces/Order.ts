import { Product } from '.';
import { OrderState } from '../types';

export interface Order {
  id?: string;
  customerId?: string;
  table: {
    id: string;
    name: string;
  };
  products: [
    {
      product: Product;
      quantity: number;
    }
  ];
  comment: string;
  state?: OrderState;
  placed?: Date;
  accepted?: Date;
  declined?: Date;
  finished?: Date;
}
