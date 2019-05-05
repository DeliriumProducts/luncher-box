import React from 'react';
import { User } from '../interfaces';

interface Values {
  state: {
    user: Partial<User> | null;
  };
  dispatch: React.Dispatch<{
    type: any;
    payload: any;
  }>;
}

export const AdminContext = React.createContext<Values>({
  state: {
    user: {
      name: 'Loading...',
      role: 'Waiter'
    }
  },
  // tslint:disable-next-line
  dispatch: () => {}
});
