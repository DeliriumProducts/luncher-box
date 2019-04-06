import localForage from 'localforage';
import React, { Component } from 'react';
import { CustomerContext } from '../context';
import { Order, Product } from '../interfaces';

interface Props {
  children: React.ReactNode;
}

interface State {
  order: Order;
  table: string;
  totalAmount: number;
  orderHistory: Order[];
  hasFinishedSyncing: boolean;
}

class CustomerContextProvider extends Component<Props, State> {
  state: State = {
    order: {
      products: [],
      comment: '',
      table: ''
    },
    table: '',
    totalAmount: 0,
    orderHistory: [],
    hasFinishedSyncing: false
  };

  /**
   * Gets the items from localForage and updates the Context Values with them
   */
  syncWithLocalForage = async (): Promise<void> => {
    const order: Order = (await localForage.getItem('order')) || {
      products: [],
      comment: '',
      table: ''
    };

    const totalAmount: number = (await localForage.getItem('totalAmount')) || 0;

    const table: string = (await localForage.getItem('table')) || '';

    const orderHistory: Order[] =
      (await localForage.getItem('orderHistory')) || [];

    order.table = table;

    this.setState({
      order,
      totalAmount,
      table,
      orderHistory,
      hasFinishedSyncing: true
    });
  };

  /**
   * Clears the current order (removes products and comment) and resets the totalAmount
   */
  clear = async () => {
    this.setState(prevState => ({
      order: {
        ...prevState.order,
        products: [],
        comment: ''
      },
      totalAmount: 0
    }));

    return Promise.all([
      localForage.removeItem('order'),
      localForage.removeItem('totalAmount')
    ]);
  };

  /**
   * Increments / adds the quantity of a given product in the current order
   */
  increment = async (product: Product) => {
    this.setState(
      prevState => {
        let isNewProduct = true;

        const editedProducts: Product[] = [];

        prevState.order.products.forEach(p => {
          if (p.id === product.id) {
            isNewProduct = false;

            editedProducts.push({
              ...p,
              quantity: p.quantity! + 1
            });
            return;
          }

          editedProducts.push(p);
        });

        if (isNewProduct) {
          editedProducts.push({ ...product, quantity: 1 });
        }

        return {
          order: {
            ...prevState.order,
            products: editedProducts
          },
          totalAmount: prevState.totalAmount + 1
        };
      },
      () => {
        localForage.setItem('order', this.state.order);
        localForage.setItem('totalAmount', this.state.totalAmount);
      }
    );
  };

  /**
   * Decrements / removes the quantity of a given product in the current order
   */
  decrement = async (product: Product) => {
    this.setState(
      prevState => {
        let isNewProduct = true;

        const editedProducts: Product[] = [];
        prevState.order.products.forEach(p => {
          if (p.id === product.id) {
            isNewProduct = false;

            if (p.quantity! === 1) {
              return;
            }

            editedProducts.push({
              ...p,
              quantity: p.quantity! - 1
            });
            return;
          }

          editedProducts.push(p);
        });

        if (isNewProduct) {
          return {
            ...prevState
          };
        }

        return {
          order: {
            ...prevState.order,
            products: editedProducts
          },
          totalAmount: prevState.totalAmount - 1
        };
      },
      () => {
        localForage.setItem('order', this.state.order);
        localForage.setItem('totalAmount', this.state.totalAmount);
      }
    );
  };

  /**
   * Adds a comment to the current order
   */
  comment = (comment: string) => {
    this.setState(
      prevState => ({ order: { ...prevState.order, comment } }),
      () => {
        localForage.setItem('order', this.state.order);
      }
    );
  };

  /**
   * Sets the table of the current order and in localForage
   */
  setTable = (id: string) => {
    this.setState(
      prevState => ({
        order: {
          ...prevState.order,
          table: id
        },
        table: id
      }),
      () => {
        localForage.setItem('order', this.state.order);
        localForage.setItem('table', id);
      }
    );
  };

  /**
   * Updates a given order inside the orderHistory
   */
  updateOrderHistory = (order: Order) => {
    this.setState(
      prevState => {
        const orderHistory: Order[] = [];

        prevState.orderHistory.forEach(o => {
          if (o.id === order.id) {
            orderHistory.push(order);

            return;
          }

          orderHistory.push(o);
        });

        return {
          orderHistory
        };
      },
      async () => {
        localForage.setItem('orderHistory', this.state.orderHistory);
      }
    );
  };

  /**
   * Completely overwrites the orderHistory
   */
  overwriteOrderHistory = (orders: Order[]) => {
    this.setState({ orderHistory: orders }, async () => {
      localForage.setItem('orderHistory', this.state.orderHistory);
    });
  };

  /**
   * Pushes a new order to orderHistory
   */
  pushOrderHistory = (order: Order) => {
    this.setState(
      prevState => {
        const { orderHistory } = { ...prevState };
        orderHistory.unshift(order);

        return {
          orderHistory
        };
      },
      async () => {
        localForage.setItem('orderHistory', this.state.orderHistory);
      }
    );
  };

  /**
   * Sync state with localForage whenever the component loads
   */
  componentDidMount = () => {
    this.syncWithLocalForage();
  };

  render() {
    return (
      <CustomerContext.Provider
        value={{
          ...this.state,
          actions: {
            syncWithLocalForage: this.syncWithLocalForage,
            clear: this.clear,
            increment: this.increment,
            decrement: this.decrement,
            comment: this.comment,
            setTable: this.setTable,
            updateOrderHistory: this.updateOrderHistory,
            overwriteOrderHistory: this.overwriteOrderHistory,
            pushOrderHistory: this.pushOrderHistory
          }
        }}
      >
        {this.props.children}
      </CustomerContext.Provider>
    );
  }
}

const CartConsumer = CustomerContext.Consumer;

export default CustomerContextProvider;
export { CartConsumer };
