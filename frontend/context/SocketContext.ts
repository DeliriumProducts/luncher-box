import React from 'react';

interface Values {
  socket: SocketIOClient.Socket | undefined;
}

export const SocketContext = React.createContext<Values>({
  socket: undefined
});
