import { Product } from '.';

/**
 * Used for the Category entity from the backend
 */
export interface Category {
  id: number;
  name: string;
  image: string;
  products?: Product[];
}
