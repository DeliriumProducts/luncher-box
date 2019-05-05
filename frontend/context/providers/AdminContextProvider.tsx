import React from 'react';
import { AdminContext } from '..';
import { Order, User } from '../../interfaces';
import { OrderState } from '../../types';

interface Props {
  children: React.ReactNode;
}

interface State {
  user: Partial<User>;
  orders: Order[];
  loading: boolean;
}

const initalState: State = {
  user: {
    name: '',
    role: 'Waiter'
  },
  orders: [],
  loading: true
};

const handlers = {
  setUser(state, user: User): State {
    return {
      ...state,
      user
    };
  },
  setOrderState(
    state,
    { id, orderState }: { id: string; orderState: OrderState }
  ) {
    return {
      ...state,
      orders: state.orders.map(order => {
        if (order.id === id) {
          return {
            ...order,
            state: orderState
          };
        }

        return order;
      })
    };
  },
  setOrders(state, orders: Order[]) {
    return {
      ...state,
      orders
    };
  },
  setLoading(state, loading: boolean) {
    return {
      ...state,
      loading
    };
  }
};

const reducer = (state = initalState, { type, payload }): State => {
  if (handlers[type]) {
    return handlers[type](state, payload);
  } else {
    return state;
  }
};

const AdminContextProvider = (props: Props) => {
  const [state, dispatch] = React.useReducer(reducer, initalState);

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AdminContext.Provider>
  );
};

export { AdminContextProvider };
