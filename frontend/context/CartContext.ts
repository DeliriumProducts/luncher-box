import React from 'react';
import { Product, Order } from '../interfaces';

interface Values {
  order: Order;
  totalAmount: number;
  actions: {
    reload: () => Promise<void>;
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    comment: (comment: string) => void;
    setTable: (id: string) => void;
  };
}

export const CartContext = React.createContext<Values>({
  order: {
    id: 1,
    products: [],
    comment: '',
    table: '1'
  },
  totalAmount: 0,
  actions: {
    // tslint:disable
    reload: () => {
      return new Promise((resolve, reject) => null);
    },
    increment: () => {},
    decrement: () => {},
    comment: () => {},
    setTable: () => {}
    // tslint:enable
  }
});
