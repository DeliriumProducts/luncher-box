import { Category } from '../interfaces';
import React from 'react';

interface Values {
  isAuthenticated: boolean;
  categories: Category[];
  actions: {
    updateCategories: () => void;
    addCategory: (category: Category) => void;
    addCategories: (categories: Category[]) => void;
  };
}

export const AdminContext = React.createContext<Values>({
  isAuthenticated: false,
  categories: [],
  actions: {
    updateCategories: () => {},
    addCategory: () => {},
    addCategories: () => {}
  }
});
