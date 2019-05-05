import React from 'react';
import { AdminContext } from '..';
import { User } from '../../interfaces';

interface Props {
  children: React.ReactNode;
}

interface State {
  user: Partial<User>;
}

const initalState: State = {
  user: {
    name: '',
    role: 'Waiter'
  }
};

const handlers = {
  setUser(state, payload: User): State {
    return {
      ...state,
      user: payload
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
