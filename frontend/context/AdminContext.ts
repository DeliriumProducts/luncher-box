import React from 'react';
import { Order, User } from '../interfaces';

interface Values {
  state: {
    user: Partial<User>;
    orders: Order[];
    loading: boolean;
  };
  dispatch: React.Dispatch<{
    type: any;
    payload: any;
  }>;
}

export const AdminContext = React.createContext<Values>({
  state: {
    user: {
      name: '',
      role: 'Waiter'
    },
    orders: [],
    loading: true
  },
  // tslint:disable-next-line
  dispatch: () => {}
});
