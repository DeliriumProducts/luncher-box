import React from 'react';
import { Product } from '../interfaces';

interface Values {
  products: Product[];
  comment: string;
  actions: {
    add: (product: Product) => void;
    remove: (product: Product) => void;
    comment: (comment: string) => void;
  };
}

export const CartContext = React.createContext<Values>({
  products: [],
  comment: '',
  actions: {
    // tslint:disable
    add: () => {},
    remove: () => {},
    comment: () => {}
    // tslint:enable
  }
});
