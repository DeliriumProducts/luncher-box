import { Category } from '.';

export interface Product {
  name: string;
  description: string;
  image: string;
  price: number;
  categories: object[];
}
