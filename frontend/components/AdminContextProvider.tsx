import React, { Component } from 'react';
import { CategoryAPI, ProductAPI } from '../api';
import { AdminContext } from '../context';
import { Category, Product } from '../interfaces';
import { EntityInstance, EntityTypes } from '../types';
import { BACKEND_URL } from '../config';
import io from 'socket.io-client';

interface Props {
  children: React.ReactNode;
}

interface State {
  entities: {
    products: Product[];
    categories: Category[];
  };
}

const socket = io(`${BACKEND_URL}`);

class AdminContextProvider extends Component<Props, State> {
  state: State = {
    entities: {
      products: [],
      categories: []
    }
  };

  update = async (categoryIndex?: number) => {
    const entities = { ...this.state.entities };

    let newProducts: Product[] = [];
    let newCategories: Category[] = [];
    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    /**
     * If there is no categoryIndex provided we update only the categories
     */
    if (!categoryIndex) {
      /**
       * If there are entities in the context, we can fetch ONLY the entities that we are missing
       */

      if (entities.categories.length) {
        const { categories: oldCategories } = entities;
        const { id: lastCategoryId } = entities.categories[
          entities.categories.length - 1
        ];

        const fetchedCategories = await CategoryAPI.getAll({
          since: lastCategoryId
        });

        newCategories.push(...oldCategories, ...fetchedCategories);
      } else {
        newCategories = await CategoryAPI.getAll();
      }
    } else {
      /**
       * If there are categories in the context, we can fetch ONLY the categories that we are missing
       */
      if (entities.categories.length) {
        const { categories: oldCategories } = entities;
        const { id: lastCategoryId } = entities.categories[
          entities.categories.length - 1
        ];

        const fetchedCategories = await CategoryAPI.getAll({
          since: lastCategoryId
        });

        newCategories.push(...oldCategories, ...fetchedCategories);
      } else {
        newCategories = await CategoryAPI.getAll();
      }

      const fetchedProducts = (await CategoryAPI.getOne(categoryIndex, true))
        .products;

      newProducts = fetchedProducts!;
    }

    newEntities.categories = newCategories;
    newEntities.products = newProducts;

    this.setState({ entities: newEntities });
  };

  push = async (newEntity: EntityInstance, entityType: EntityTypes) => {
    const entities = { ...this.state.entities };

    /**
     * Make "deep" clones of the arrays, to prevent modifying the state directly
     */
    let newProducts: Product[] = [...entities.products];
    let newCategories: Category[] = [...entities.categories];
    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    if (entityType === 'category') {
      newCategories.push(newEntity as Category);
    } else if (entityType === 'product') {
      let shouldBeAdded = false;

      if (newProducts.length) {
        let temp = await ProductAPI.getOne(newProducts[0].id);

        /**
         * Check wheter context should be updated with the new product
         * (should be updated only if current category list of one of the products
         * containts at least one of the categories which the new product has)
         */
        for (const category of (newEntity as Product).categories!) {
          if (temp.categories!.includes(category)) {
            shouldBeAdded = true;
          }
        }
      }

      delete (newEntity as Product).categories;
      if (shouldBeAdded) {
        newProducts.push(newEntity as Product);
      }
    }

    newEntities.categories = newCategories;
    newEntities.products = newProducts;

    this.setState({ entities: newEntities });
  };

  edit = (newEntity: EntityInstance, entityType: EntityTypes) => {
    const entities = { ...this.state.entities };

    /**
     * Make "deep" clones of the arrays, to prevent modifying the state directly
     */
    let newProducts: Product[] = [...entities.products];
    let newCategories: Category[] = [...entities.categories];
    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    if (entityType === 'category') {
      const categoryIndex = this.findEntityIndex(newEntity.id, 'category');
      newCategories[categoryIndex] = { ...(newEntity as Category) };
    } else {
      const productIndex = this.findEntityIndex(newEntity.id, 'product');

      newProducts[productIndex] = { ...(newEntity as Product) };
    }

    newEntities.categories = newCategories;
    newEntities.products = newProducts;

    this.setState({ entities: newEntities });
  };

  delete = async (entityId: number, entityType: EntityTypes) => {
    const entities = { ...this.state.entities };

    /**
     * Make "deep" clones of the arrays, to prevent modifying the state directly
     */
    const newProducts: Product[] = [...entities.products];
    const newCategories: Category[] = [...entities.categories];
    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    if (entityType === 'category') {
      const categoryIndex = newCategories.findIndex(
        ({ id }) => id === entityId
      );

      /**
       * Fetch the category in order to get all of its products
       */
      const categoryToBeDeleted = await CategoryAPI.getOne(entityId, true);

      if (categoryToBeDeleted.products) {
        /**
         * Remove products from the category before deleting it
         */
        for (const product of categoryToBeDeleted.products) {
          /**
           * Remove the product if it desn't belong to any other categories
           */
          if (product.categories && product.categories.length < 2) {
            const productIndex = newProducts.findIndex(
              ({ id }) => id === product.id
            );

            newProducts.splice(productIndex, 1);
          }
        }
      }

      newCategories.splice(categoryIndex, 1);
    } else {
      const productIndex = newProducts.findIndex(({ id }) => id === entityId);
      newProducts.splice(productIndex, 1);
    }

    newEntities.products = newProducts;
    newEntities.categories = newCategories;

    this.setState({ entities: newEntities });
  };

  findEntityIndex = (id: number, entityType: EntityTypes) => {
    if (entityType === 'category') {
      return this.state.entities.categories.findIndex(
        ({ id: categoryId }: Category) => categoryId === id
      );
    } else {
      return this.state.entities.products.findIndex(
        ({ id: productId }: Product) => productId === id
      );
    }
  };

  render() {
    const { entities } = this.state;

    return (
      <AdminContext.Provider
        value={{
          entities,
          socket,
          actions: {
            update: this.update,
            push: this.push,
            edit: this.edit,
            delete: this.delete
          }
        }}
      >
        {this.props.children}
      </AdminContext.Provider>
    );
  }
}

// then make a consumer which will surface it
const AdminConsumer = AdminContext.Consumer;

export default AdminContextProvider;
export { AdminConsumer };
