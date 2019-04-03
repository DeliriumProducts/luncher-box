import React from 'react';
import io from 'socket.io-client';
import { SOCKET_URL } from '../config';
import { SocketContext } from '../context';

interface Props {
  children: React.ReactNode;
}

const SocketContextProvider = (props: Props) => {
  const [socket] = React.useState(io(`${SOCKET_URL}`));

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
