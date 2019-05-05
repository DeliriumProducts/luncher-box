import React from 'react';
import { Order, Product, Table } from '../interfaces';

interface Values {
  order: Order;
  totalAmount: number;
  orderHistory: Order[];
  hasFinishedSyncing: boolean;
  actions: {
    syncWithLocalForage: () => void;
    clear: () => Promise<[void, void]>;
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    comment: (comment: string) => void;
    setTable: (table: Table) => void;
    updateOrderHistory: (order: Order) => void;
    overwriteOrderHistory: (orders: Order[]) => void;
    pushOrderHistory: (order: Order) => void;
  };
}

export const CustomerContext = React.createContext<Values>({
  order: {
    products: [],
    comment: '',
    table: {
      name: 'A1',
      id: '1'
    }
  },
  orderHistory: [],
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
