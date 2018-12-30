import { Category } from './';

/**
 * Used for the Product entity from the backend
 */
export interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  categories: Category[];
}
