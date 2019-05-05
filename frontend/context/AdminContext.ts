import React from 'react';
import { User } from '../interfaces';

interface Values {
  state: {
    user: Partial<User>;
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
    }
  },
  // tslint:disable-next-line
  dispatch: () => {}
});
