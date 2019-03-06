import React from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { AdminContext } from '../context';

interface Props {
  children: React.ReactNode;
}

const socket = io(`${SOCKET_URL}`);

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

const AdminConsumer = AdminContext.Consumer;

export default AdminContextProvider;
export { AdminConsumer };
