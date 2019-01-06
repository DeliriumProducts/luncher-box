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
    editEntity: (entity: EntityInstance, entityType: EntityTypes) => void;
    deleteEntity: (entity: EntityInstance, entityType: EntityTypes) => void;
  };
  loading: boolean;
}

export const EntityContext = React.createContext<Values>({
  entities: {
    products: [],
    categories: []
  },
  actions: {
    // tslint:disable
    updateEntities: () => {},
    pushEntity: () => {},
    editEntity: () => {},
    deleteEntity: () => {}
    // tslint:enable
  },
  loading: false
});
