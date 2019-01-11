import React from 'react';
import { Product, Order } from '../interfaces';

interface Values {
  order: Order;
  totalAmount: number;
  actions: {
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    comment: (comment: string) => void;
  };
}

export const CartContext = React.createContext<Values>({
  order: {
    id: 1,
    products: [],
    comment: '',
    tableId: '1'
  },
  totalAmount: 0,
  actions: {
    // tslint:disable
    increment: () => {},
    decrement: () => {},
    comment: () => {}
    // tslint:enable
  }
});
