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

  syncWithLocalForage = async (): Promise<void> => {
    const currentOrder: Order = (await localForage.getItem('currentOrder')) || {
      products: [],
      comment: '',
      table: ''
    };

    const totalAmount: number = (await localForage.getItem('totalAmount')) || 0;

    const table: string = (await localForage.getItem('table')) || '';

    const orderHistory: Order[] =
      (await localForage.getItem('orderHistory')) || [];

    currentOrder.table = table;

    this.setState({
      order: currentOrder,
      totalAmount,
      table,
      orderHistory,
      hasFinishedSyncing: true
    });
  };

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
      localForage.removeItem('currentOrder'),
      localForage.removeItem('totalAmount')
    ]);
  };

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
        localForage.setItem('currentOrder', this.state.order);
        localForage.setItem('totalAmount', this.state.totalAmount);
      }
    );
  };

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
        localForage.setItem('currentOrder', this.state.order);
        localForage.setItem('totalAmount', this.state.totalAmount);
      }
    );
  };

  comment = (comment: string) => {
    this.setState(
      prevState => ({ order: { ...prevState.order, comment } }),
      () => {
        localForage.setItem('currentOrder', this.state.order);
      }
    );
  };

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
        localForage.setItem('currentOrder', this.state.order);
        localForage.setItem('table', id);
      }
    );
  };

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

  overwriteOrderHistory = (orders: Order[]) => {
    this.setState({ orderHistory: orders }, async () => {
      localForage.setItem('orderHistory', this.state.orderHistory);
    });
  };

  pushOrderHistory = (order: Order) => {
    this.setState(
      prevState => {
        const { orderHistory } = { ...prevState };
        orderHistory.push(order);

        return {
          orderHistory
        };
      },
      async () => {
        localForage.setItem('orderHistory', this.state.orderHistory);
      }
    );
  };

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
