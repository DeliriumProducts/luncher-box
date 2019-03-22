import React from 'react';
import { Order, Product } from '../interfaces';

interface Values {
  order: Order;
  totalAmount: number;
  table: string;
  socket: SocketIOClient.Socket | undefined;
  orderHistory: Order[];
  actions: {
    reload: () => Promise<void>;
    clear: () => Promise<[void, void]>;
    increment: (product: Product) => void;
    decrement: (product: Product) => void;
    comment: (comment: string) => void;
    setTable: (id: string) => void;
    addToHistory: () => void;
  };
}

export const CustomerContext = React.createContext<Values>({
  order: {
    id: 1,
    products: [],
    comment: '',
    table: '1'
  },
  orderHistory: [],
  table: '',
  totalAmount: 0,
  socket: undefined,
  actions: {
    // tslint:disable
    reload: () => {
      return new Promise((resolve, reject) => undefined);
    },
    clear: () => {
      return Promise.all([undefined, undefined]);
    },
    increment: () => {},
    decrement: () => {},
    comment: () => {},
    setTable: () => {},
    addToHistory: () => {}
    // tslint:enable
  }
});
