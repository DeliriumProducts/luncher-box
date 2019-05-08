import localForage from 'localforage';
import React from 'react';
import { AdminContext } from '..';
import { Order, User } from '../../interfaces';
import { OrderState } from '../../types';

interface Props {
  children: React.ReactNode;
}

interface State {
  user: Partial<User>;
  preferences: {
    showLast: number;
  };
  orders: Order[];
  loading: boolean;
}

const initalState: State = {
  user: {
    name: '',
    role: 'Waiter'
  },
  preferences: {
    showLast: 10
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
  setPreferences(state, preferences) {
    return {
      ...state,
      preferences
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
  pushOrder(state, order: Order) {
    return {
      ...state,
      orders: [order, ...state.orders]
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

  React.useEffect(() => {
    let preferences: {} = {};

    localForage.getItem('preferences').then(pref => {
      if (pref) {
        preferences = pref;
      }

      dispatch({ type: 'setPreferences', payload: preferences });
    });
  }, []);

  React.useEffect(() => {
    let currentPreferencesFromLocalForage: {} = {};

    localForage.getItem('preferences').then(pref => {
      if (pref) {
        currentPreferencesFromLocalForage = pref;
      }

      if (
        JSON.stringify(currentPreferencesFromLocalForage) !==
        JSON.stringify(state.preferences)
      ) {
        localForage.setItem('preferences', state.preferences);
      }
    });
  }, [state.preferences]);

  return (
    <AdminContext.Provider value={{ state, dispatch }}>
      {props.children}
    </AdminContext.Provider>
  );
};

export { AdminContextProvider };
