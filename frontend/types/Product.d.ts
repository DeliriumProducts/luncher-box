import { Category } from '.';

export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  categories: Category[];
}
