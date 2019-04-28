import React from 'react';
import { Order, Product } from '../interfaces';

interface Values {
  order: Order;
  totalAmount: number;
  table: string;
  orderHistory: Order[];
  hasFinishedSyncing: boolean;
  actions: {
    syncWithLocalForage: () => void;
    clear: () => Promise<[void, void]>;
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    comment: (comment: string) => void;
    setTable: (id: string) => void;
    updateOrderHistory: (order: Order) => void;
    overwriteOrderHistory: (orders: Order[]) => void;
    pushOrderHistory: (order: Order) => void;
  };
}

export const CustomerContext = React.createContext<Values>({
  order: {
    products: [
      {
        product: {
          name: '',
          description: '',
          image: '',
          price: 1,
          id: 1
        },
        quantity: 0
      }
    ],
    comment: '',
    table: {
      name: 'A1',
      id: '1'
    }
  },
  orderHistory: [],
  table: '',
  totalAmount: 0,
  hasFinishedSyncing: false,
  actions: {
    // tslint:disable
    syncWithLocalForage: () => {},
    clear: () => {
      return Promise.all([undefined, undefined]);
    },
    increment: () => {},
    decrement: () => {},
    comment: () => {},
    setTable: () => {},
    updateOrderHistory: () => {},
    overwriteOrderHistory: () => {},
    pushOrderHistory: () => {}
    // tslint:enable
  }
});
