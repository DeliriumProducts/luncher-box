import React from 'react';

interface Values {
  socket: SocketIOClient.Socket | undefined;
}

export const AdminContext = React.createContext<Values>({
  socket: undefined
});
