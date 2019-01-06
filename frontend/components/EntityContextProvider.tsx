import React, { Component } from 'react';
import { CategoryAPI, ProductAPI } from '../api';
import { EntityContext } from '../context';
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

class EntityProvider extends Component<Props, State> {
  state: State = {
    entities: {
      products: [],
      categories: []
    }
  };

  updateEntities = async () => {
    const entities = { ...this.state.entities };

    let newProducts: Product[] = [];
    let newCategories: Category[] = [];
    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    /**
     * If there are entities in the context, we can fetch ONLY the entities that we are missing
     */

    if (entities.products.length) {
      const { products: oldProducts } = entities;
      const { id: lastProductId } = entities.products[
        entities.products.length - 1
      ];

      const fetchedProducts = await ProductAPI.getAll({ since: lastProductId });

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

    newEntities.categories = newCategories;
    newEntities.products = newProducts;
    this.setState({ entities: newEntities });
  };

  pushEntity = (newEntity: EntityInstance, entityType: EntityTypes) => {
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
      newProducts.push(newEntity as Product);
    }

    newEntities.categories = newCategories;
    newEntities.products = newProducts;

    this.setState({ entities: newEntities });
  };

  editEntity = (entity: EntityInstance, entityType: EntityTypes) => {
    const entities = { ...this.state.entities };

    const newProducts: Product[] = [...entities.products];
    const newCategories: Category[] = [...entities.categories];

    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    if (entityType == 'category') {
      newCategories.find(
        (category: Category, i: number): any => {
          if (category.id === entity.id) {
            newCategories[i] = { ...entity };
            return true; // stop searching
          }
        }
      );
    } else {
      newProducts.find(
        (product: Product, i: number): any => {
          if (product.id === entity.id) {
            newProducts[i] = { ...(entity as Product) };
            return true; // stop searching
          }
        }
      );
    }

    newEntities.categories = newCategories;
    newEntities.products = newProducts;

    this.setState({ entities: newEntities });
  };

  deleteEntity = (entity: EntityInstance, entityType: EntityTypes) => {
    const entities = { ...this.state.entities };

    const newProducts: Product[] = [...entities.products];
    const newCategories: Category[] = [...entities.categories];

    const newEntities: typeof entities = {
      products: newProducts,
      categories: newCategories
    };

    if (entityType === 'category') {
      const categoryId = newCategories.findIndex(({ id }) => id === entity.id);
      newCategories.splice(categoryId, 1);
    } else {
      console.log(newProducts);
      const productId = newProducts.findIndex(({ id }) => id === entity.id);
      newProducts.splice(productId, 1);
    }

    newEntities.products = newProducts;
    newEntities.categories = newCategories;

    this.setState({ entities: newEntities });
  };

  /**
   * We update the current context for every render
   */
  render() {
    const { entities } = this.state;

    return (
      <EntityContext.Provider
        value={{
          entities,
          actions: {
            updateEntities: this.updateEntities,
            pushEntity: this.pushEntity,
            editEntity: this.editEntity,
            deleteEntity: this.deleteEntity
          }
        }}
      >
        {this.props.children}
      </EntityContext.Provider>
    );
  }
}

// then make a consumer which will surface it
const UserConsumer = EntityContext.Consumer;

export default EntityProvider;
export { UserConsumer };
