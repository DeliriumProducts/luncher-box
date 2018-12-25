import { Product } from './../types/Product';
import { Category } from './../types/Category';
import React from 'react';

interface Values {
  categories: Category[];
}

export default React.createContext<Values>({
  categories: []
});
