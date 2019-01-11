import React, { Component } from 'react';
import { CartContext } from '../context';
import { Product, Order } from '../interfaces';

interface Props {
  children: React.ReactNode;
}

interface State {
  order: Order;
  totalAmount: number;
}

class CartContextProvider extends Component<Props, State> {
  state: State = {
    order: {
      id: 1,
      products: [],
      comment: '',
      tableId: '1'
    },
    totalAmount: 0
  };

  increment = (product: Product) => {
    const products = [...this.state.order.products];
    let { totalAmount } = this.state;
    const newProduct = { ...product };

    const productIndex = this.findProductIndex(newProduct.id);

    if (productIndex > -1) {
      /**
       * Gets the old quantity and adds 1
       */
      const oldQuantity = products[productIndex].quantity;
      if (oldQuantity) {
        products[productIndex].quantity = oldQuantity + 1;
      }
    } else {
      newProduct.quantity = 1;
      products.push(newProduct);
    }

    totalAmount++;
    this.setState(prevState => ({
      order: { ...prevState.order, products },
      totalAmount
    }));
  };

  decrement = (product: Product) => {
    const products = [...this.state.order.products];
    let { totalAmount } = this.state;

    const productIndex = this.findProductIndex(product.id);

    if (productIndex > -1) {
      if (products[productIndex].quantity) {
        /**
         * Gets the old quantity and remove 1, deletes the product if it's less than or eq. to 0
         */
        const oldQuantity = products[productIndex].quantity;
        if (oldQuantity) {
          if (oldQuantity - 1 > 0) {
            products[productIndex].quantity = oldQuantity - 1;
          } else {
            products.splice(productIndex, 1);
          }
        }
      }
    } else {
      return;
    }

    totalAmount--;
    this.setState(prevState => ({
      order: { ...prevState.order, products },
      totalAmount
    }));
  };

  comment = (comment: string) => {
    this.setState(prevState => ({ order: { ...prevState.order, comment } }));
  };

  findProductIndex = (id: number) => {
    return this.state.order.products.findIndex(
      ({ id: productId }: Product) => productId === id
    );
  };

  render() {
    const { order, totalAmount } = this.state;
    return (
      <CartContext.Provider
        value={{
          order,
          totalAmount,
          actions: {
            increment: this.increment,
            decrement: this.decrement,
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
