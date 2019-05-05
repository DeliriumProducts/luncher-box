import React from 'react';
import { User } from '../interfaces';

interface Values {
  user: Partial<User>;
}

export const AdminContext = React.createContext<Values>({
  user: {
    name: 'Loading...',
    role: 'Waiter'
  }
});
