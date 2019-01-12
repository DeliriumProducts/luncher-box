import React from 'react';
import { Product, Order } from '../interfaces';

interface Values {
  order: Order;
  totalAmount: number;
  socket: SocketIOClient.Socket | undefined;
  actions: {
    reload: () => Promise<void>;
    clear: () => Promise<[void, void, void]>;
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
  socket: undefined,
  actions: {
    // tslint:disable
    reload: () => {
      return new Promise((resolve, reject) => undefined);
    },
    clear: () => {
      return Promise.all([undefined, undefined, undefined]);
    },
    increment: () => {},
    decrement: () => {},
    comment: () => {},
    setTable: () => {}
    // tslint:enable
  }
});
