import { Product } from './../types/Product';
import { Category } from './../types/Category';
import React from 'react';

interface Values {
  categories: Category[];
  products: Product[];
}

export default React.createContext<Values>({
  categories: [],
  products: []
});
