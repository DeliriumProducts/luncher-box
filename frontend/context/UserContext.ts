import { Category } from '../interfaces';
import React from 'react';

interface Values {
  categories: Category[];
  actions: {
    addCategory: (category: Category) => void;
  };
}

// tslint:disable
export const UserContext = React.createContext<Values>({
  categories: [],
  actions: {
    addCategory: () => {}
  }
});
