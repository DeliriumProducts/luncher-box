import localForage from 'localforage';
import React, { Component } from 'react';
import io from 'socket.io-client';
import { BACKEND_URL } from '../config';
import { CartContext } from '../context';
import { Order, Product } from '../interfaces';

interface Props {
  children: React.ReactNode;
}

interface State {
  order: Order;
  table: string;
  totalAmount: number;
}

const socket = io(`${BACKEND_URL}`);

class CartContextProvider extends Component<Props, State> {
  state: State = {
    order: {
      products: [],
      comment: '',
      table: ''
    },
    table: '',
    totalAmount: 0
  };

  reload = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const currentOrder: Order = await localForage.getItem('currentOrder');
      const totalAmount: number = await localForage.getItem('totalAmount');
      const table: string = await localForage.getItem('table');

      if (table && currentOrder) {
        currentOrder.table = table;
      }

      if (currentOrder && totalAmount && table) {
        this.setState({ order: currentOrder, totalAmount, table }, () =>
          resolve()
        );
      } else {
        resolve();
      }
    });
  };

  clear = async () => {
    this.setState({
      order: {
        id: 1,
        products: [],
        comment: '',
        table: ''
      },
      table: '',
      totalAmount: 0
    });

    return Promise.all([
      localForage.removeItem('currentOrder'),
      localForage.removeItem('totalAmount')
    ]);
  };

  increment = async (product: Product) => {
    const products = [...this.state.order.products];
    let { totalAmount } = this.state;
    const newProduct = { ...product };

    const productIndex = this.findProductIndex(newProduct.id);

    if (productIndex >= 0) {
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
    this.setState(
      prevState => ({
        order: { ...prevState.order, products },
        totalAmount
      }),
      async () => {
        await localForage.setItem('currentOrder', this.state.order);
        await localForage.setItem('totalAmount', this.state.totalAmount);
      }
    );
  };

  decrement = async (product: Product) => {
    const products = [...this.state.order.products];
    let { totalAmount } = this.state;

    const productIndex = this.findProductIndex(product.id);

    if (productIndex >= 0) {
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
    this.setState(
      prevState => ({
        order: { ...prevState.order, products },
        totalAmount
      }),
      async () => {
        await localForage.setItem('currentOrder', this.state.order);
        await localForage.setItem('totalAmount', this.state.totalAmount);
      }
    );
  };

  comment = (comment: string) => {
    this.setState(
      prevState => ({ order: { ...prevState.order, comment } }),
      async () => {
        await localForage.setItem('currentOrder', this.state.order);
      }
    );
  };

  setTable = (id: string) => {
    this.setState(
      prevState => ({ order: { ...prevState.order, table: id } }),
      async () => {
        await localForage.setItem('currentOrder', this.state.order);
        await localForage.setItem('table', id);
      }
    );
  };

  findProductIndex = (id: number) => {
    return this.state.order.products.findIndex(
      ({ id: productId }: Product) => productId === id
    );
  };

  render() {
    const { order, table, totalAmount } = this.state;
    return (
      <CartContext.Provider
        value={{
          order,
          totalAmount,
          socket,
          table,
          actions: {
            reload: this.reload,
            clear: this.clear,
            increment: this.increment,
            decrement: this.decrement,
            comment: this.comment,
            setTable: this.setTable
          }
        }}
      >
        {this.props.children}
      </CartContext.Provider>
    );
  }
}

const CartConsumer = CartContext.Consumer;

export default CartContextProvider;
export { CartConsumer };
