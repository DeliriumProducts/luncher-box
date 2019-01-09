import React, { Component } from 'react';
import { CategoryAPI, ProductAPI } from '../api';
import { CartContext } from '../context';
import { Category, Product } from '../interfaces';
import { EntityInstance, EntityTypes } from '../types';

interface Props {
  children: React.ReactNode;
}

interface State {
  products: Product[];
  comment: string;
}

class CartContextProvider extends Component<Props, State> {
  state: State = {
    products: [],
    comment: ''
  };

  add = (product: Product) => {
    const products = [...this.state.products];

    const productIndex = this.findProductIndex(product.id);

    if (productIndex > -1) {
      /**
       * Gets the old quantity and adds 1
       */
      const oldQuantity = products[productIndex].quantity;
      if (oldQuantity) {
        products[productIndex].quantity = oldQuantity + 1;
      }
    } else {
      product.quantity = 1;
      products.push(product);
    }

    this.setState({ products });
  };

  remove = (product: Product) => {
    const products = [...this.state.products];

    const productIndex = this.findProductIndex(product.id);

    if (productIndex > -1) {
      if (products[productIndex].quantity) {
        /**
         * Gets the old quantity and remove 1, deletes the product if it's less than or eq. to 0
         */
        const oldQuantity = products[productIndex].quantity;
        if (oldQuantity) {
          if (oldQuantity - 1 > 0) {
            products.splice(productIndex, 1);
          } else {
            products[productIndex].quantity = oldQuantity - 1;
          }
        }
      }
    } else {
      return;
    }

    this.setState({ products });
  };

  comment = (comment: string) => {
    this.setState({ comment });
  };

  findProductIndex = (id: number) => {
    return this.state.products.findIndex(
      ({ id: productId }: Product) => productId === id
    );
  };

  render() {
    const { products, comment } = this.state;

    return (
      <CartContext.Provider
        value={{
          products,
          comment,
          actions: {
            add: this.add,
            remove: this.remove,
            comment: this.comment
          }
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

// then make a consumer which will surface it
const CartConsumer = CartContext.Consumer;

export default CartContextProvider;
export { CartConsumer };
