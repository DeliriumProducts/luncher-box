import React from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { SocketContext } from '../context';

interface Props {
  children: React.ReactNode;
}

const socket = io(`${SOCKET_URL}`);

const SocketContextProvider = (props: Props) => {
  return (
    <SocketContext.Provider
      value={{
        socket
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

const SocketConsumer = SocketContext.Consumer;

export default SocketContextProvider;
export { SocketConsumer };
