import { Product } from './../types/Product';
import { Category } from './../types/Category';
import React from 'react';

interface Values {
  categories: Category[];
}

export const UserContext = React.createContext<Values>({
  categories: []
});
