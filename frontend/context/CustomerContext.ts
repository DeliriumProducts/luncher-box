import React from 'react';
import { Order, Product } from '../interfaces';

interface Values {
  order: Order;
  totalAmount: number;
  table: string;
  orderHistory: Order[];
  actions: {
    syncWithLocalForage: () => Promise<void>;
    clear: () => Promise<[void, void]>;
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    comment: (comment: string) => void;
    setTable: (id: string) => void;
    addToHistory: () => void;
    updateOrderHistory: (order: Order) => void;
  };
}

export const CustomerContext = React.createContext<Values>({
  order: {
    products: [],
    comment: '',
    table: '1'
  },
  orderHistory: [],
  table: '',
  totalAmount: 0,
  actions: {
    // tslint:disable
    syncWithLocalForage: () => {
      return new Promise((resolve, reject) => undefined);
    },
    clear: () => {
      return Promise.all([undefined, undefined]);
    },
    increment: () => {},
    decrement: () => {},
    comment: () => {},
    setTable: () => {},
    addToHistory: () => {},
    updateOrderHistory: () => {}
    // tslint:enable
  }
});
