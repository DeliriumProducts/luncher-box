import React from 'react';
import { EntityInstance, EntityTypes } from '../types';
import { Product, Category } from '../interfaces';

interface Values {
  entities: {
    products: Product[];
    categories: Category[];
  };

  actions: {
    update: (entityType?: EntityTypes) => void;
    push: (newEntity: EntityInstance, entityType: EntityTypes) => void;
    edit: (entity: EntityInstance, entityType: EntityTypes) => void;
    delete: (entity: EntityInstance, entityType: EntityTypes) => void;
  };
}

export const AdminContext = React.createContext<Values>({
  entities: {
    products: [],
    categories: []
  },
  actions: {
    // tslint:disable
    update: () => {},
    push: () => {},
    edit: () => {},
    delete: () => {}
    // tslint:enable
  }
});
