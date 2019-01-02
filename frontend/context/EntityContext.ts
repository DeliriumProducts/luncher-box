import { Category } from '../interfaces';
import React from 'react';

interface Values {
  categories: Category[];
  actions: {
    updateCategories: () => void;
    addCategory: (category: Category) => void;
    addCategories: (categories: Category[]) => void;
  };
}

export const EntityContext = React.createContext<Values>({
  categories: [],
  actions: {
    updateCategories: () => {},
    addCategory: () => {},
    addCategories: () => {}
  }
});
