import { Category } from '../interfaces';
import React from 'react';

interface Values {
  categories: Category[];
  actions: {
    updateCategories: () => void;
    addCategories: (categories: Category[]) => void;
  };
}

export const UserContext = React.createContext<Values>({
  categories: [],
  actions: {
    updateCategories: () => {},
    addCategories: () => {}
  }
});
