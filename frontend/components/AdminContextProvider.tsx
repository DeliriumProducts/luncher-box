import React, { Component } from 'react';
import { CategoryAPI, ProductAPI } from '../api';
import { AdminContext } from '../context';
import { Category, Product } from '../interfaces';
import { EntityInstance, EntityTypes } from '../types';

interface Props {
  children: React.ReactNode;
}

interface State {
  entities: {
    products: Product[];
    categories: Category[];
  };
}

class AdminContextProvider extends Component<Props, State> {
  state: State = {
    entities: {
      products: [],
      categories: []
    }
  };

  update = async (entityType?: EntityTypes) => {
    const entities = { ...this.state.entities };

    let newProducts: Product[] = [];
    let newCategories: Category[] = [];
    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    /**
     * If there is no entityType provided we update all entities
     */
    if (!entityType) {
      /**
       * If there are entities in the context, we can fetch ONLY the entities that we are missing
       */
      if (entities.products.length) {
        const { products: oldProducts } = entities;
        const { id: lastProductId } = entities.products[
          entities.products.length - 1
        ];

        const fetchedProducts = await ProductAPI.getAll({
          since: lastProductId
        });

        newProducts.push(...oldProducts, ...fetchedProducts);
      } else {
        newProducts = await ProductAPI.getAll();
      }

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
      if (entityType === 'category') {
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
      } else {
        /**
         * If there are products in the context, we can fetch ONLY the products that we are missing
         */
        if (entities.products.length) {
          const { products: oldProducts } = entities;
          const { id: lastProductId } = entities.products[
            entities.products.length - 1
          ];

          const fetchedProducts = await ProductAPI.getAll({
            since: lastProductId
          });

          newProducts.push(...oldProducts, ...fetchedProducts);
        } else {
          newProducts = await ProductAPI.getAll();
        }
      }
    }
    newEntities.categories = newCategories;
    newEntities.products = newProducts;

    this.setState({ entities: newEntities });
  };

  push = (newEntity: EntityInstance, entityType: EntityTypes) => {
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
      newCategories.push(newEntity as Category);
    } else if (entityType === 'product') {
      /**
       * Delete categories from product
       */
      delete (newEntity as Product).categories;
      newProducts.push(newEntity as Product);
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
    const newProducts: Product[] = [...entities.products];
    const newCategories: Category[] = [...entities.categories];
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

  delete = async (entity: EntityInstance, entityType: EntityTypes) => {
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
        ({ id }) => id === entity.id
      );

      /**
       * Fetch the category in order to get all of its products
       */
      const categoryToBeDeleted = await CategoryAPI.getOne(entity.id, true);

      if (categoryToBeDeleted.products) {
        console.log(categoryToBeDeleted.products);
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
      const productIndex = newProducts.findIndex(({ id }) => id === entity.id);
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
