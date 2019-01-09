import React from 'react';
import { Product } from '../interfaces';

interface Values {
  products: Product[];
  comment: string;
  actions: {
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    comment: (comment: string) => void;
  };
}

export const CartContext = React.createContext<Values>({
  products: [],
  comment: '',
  actions: {
    // tslint:disable
    increment: () => {},
    decrement: () => {},
    comment: () => {}
    // tslint:enable
  }
});
