import React from 'react';
import { EntityInstance, EntityTypes } from '../types';
import { Product, Category } from '../interfaces';

interface Values {
  entities: {
    products: Product[];
    categories: Category[];
  };
  socket: SocketIOClient.Socket | undefined;
  actions: {
    update: (categoryIndex?: number) => void;
    push: (newEntity: EntityInstance, entityType: EntityTypes) => void;
    edit: (entity: EntityInstance, entityType: EntityTypes) => void;
    delete: (entityId: number, entityType: EntityTypes) => void;
  };
}

export const AdminContext = React.createContext<Values>({
  entities: {
    products: [],
    categories: []
  },
  socket: undefined,
  actions: {
    // tslint:disable
    update: () => {},
    push: () => {},
    edit: () => {},
    delete: () => {}
    // tslint:enable
  }
});
