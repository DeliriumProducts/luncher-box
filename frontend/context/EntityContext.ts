import React from 'react';
import { Category } from '../interfaces';

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
