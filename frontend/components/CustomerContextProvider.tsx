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
    orderHistory: []
  };

  syncWithLocalForage = async (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      const currentOrder: Order = (await localForage.getItem(
        'currentOrder'
      )) || {
        products: [],
        comment: '',
        table: ''
      };

      const totalAmount: number =
        (await localForage.getItem('totalAmount')) || 0;

      const table: string = (await localForage.getItem('table')) || '';

      const orderHistory: Order[] =
        (await localForage.getItem('orderHistory')) || [];

      currentOrder.table = table;

      this.setState(
        { order: currentOrder, totalAmount, table, orderHistory },
        () => resolve()
      );
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
          return;
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
          return;
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

  addToHistory = () => {
    const { orderHistory: o } = { ...this.state };
    const orderHistory = [...o];

    orderHistory.push(this.state.order);

    this.setState({ orderHistory }, () => {
      localForage.setItem('orderHistory', this.state.orderHistory);
    });
  };

  updateOrderHistory = (order: Order) => {
    const { orderHistory: o } = { ...this.state };
    const orderHistory = [...o];

    // TODO: Use filter / map
    orderHistory[orderHistory.length - 1] = order;

    this.setState({ orderHistory }, async () => {
      localForage.setItem('orderHistory', this.state.orderHistory);
    });
  };

  componentDidMount() {
    this.syncWithLocalForage();
  }

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
            addToHistory: this.addToHistory,
            updateOrderHistory: this.updateOrderHistory
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
