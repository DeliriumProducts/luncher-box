import React from 'react';
import io from 'socket.io-client';
import { SocketContext } from '..';
import { SOCKET_URL } from '../../config';

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

export { SocketContextProvider };
