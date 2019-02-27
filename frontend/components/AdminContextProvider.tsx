import React from 'react';
import io from 'socket.io-client';
import { BACKEND_URL } from '../config';
import { AdminContext } from '../context';

interface Props {
  children: React.ReactNode;
}

const socket = io(`${BACKEND_URL}`);

const AdminContextProvider = (props: Props) => {
  return (
    <AdminContext.Provider
      value={{
        socket
      }}
    >
      {props.children}
    </AdminContext.Provider>
  );
};

// then make a consumer which will surface it
const AdminConsumer = AdminContext.Consumer;

export default AdminContextProvider;
export { AdminConsumer };
