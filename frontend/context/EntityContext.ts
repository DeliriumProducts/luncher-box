import React from 'react';
import { EntityInstance, EntityTypes } from '../types';
import { Product, Category } from '../interfaces';

interface Values {
  entities: {
    products: Product[];
    categories: Category[];
  };
  actions: {
    updateEntities: () => void;
    pushEntity: (newEntity: EntityInstance, entityType: EntityTypes) => void;
  };
}

export const EntityContext = React.createContext<Values>({
  entities: {
    products: [],
    categories: []
  },
  actions: {
    // tslint:disable
    updateEntities: () => {},
    pushEntity: () => {}
    // tslint:enable
  }
});
