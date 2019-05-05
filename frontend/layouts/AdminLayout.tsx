import React, { ReactNode } from 'react';
import { OrderAPI } from '../api';
import { AdminContext, SocketContext } from '../context';
import { Order } from '../interfaces';
import Layout from './_layout';

interface Props {
  route: string;
  type: 'admin' | 'customer';
  children?: ReactNode;
}

const useAdminOrders = () => {
  const adminContext = React.useContext(AdminContext);
  const socketContext = React.useContext(SocketContext);

  /**
   * Fetch the newest orders
   */
  React.useEffect(() => {
    fetchOrders();
  }, []);

  /**
   * Subscribe to different socket messages
   */
  React.useEffect(() => {
    if (socketContext.socket) {
      socketContext.socket.on('placed-order-admin', handleIncomingOrders);
      socketContext.socket.on('accepted-order-admin', setAcceptedOrder);
      socketContext.socket.on('declined-order-admin', setDeclindedOrder);
      socketContext.socket.on('finished-order-admin', setFinishedOrder);
    }
    return () => {
      if (socketContext.socket) {
        socketContext.socket.off('placed-order-admin', handleIncomingOrders);
        socketContext.socket.off('accepted-order-admin', setAcceptedOrder);
        socketContext.socket.off('declined-order-admin', setDeclindedOrder);
        socketContext.socket.off('finished-order-admin', setFinishedOrder);
      }
    };
  }, [socketContext.socket]);

  const fetchOrders = async () => {
    const incomingOrders = await OrderAPI.getAll();
    adminContext.dispatch({ type: 'setOrders', payload: incomingOrders });
    adminContext.dispatch({ type: 'setLoading', payload: false });
  };

  const handleIncomingOrders = (incomingOrders: Order[]) => {
    adminContext.dispatch({ type: 'setOrders', payload: incomingOrders });
    adminContext.dispatch({ type: 'loading', payload: false });
  };

  const setAcceptedOrder = ({ id }) => {
    adminContext.dispatch({
      type: 'setOrderState',
      payload: { id, orderState: 1 }
    });
  };

  const setFinishedOrder = ({ id }) => {
    adminContext.dispatch({
      type: 'setOrderState',
      payload: { id, orderState: 2 }
    });
  };

  const setDeclindedOrder = ({ id }) => {
    adminContext.dispatch({
      type: 'setOrderState',
      payload: { id, orderState: 3 }
    });
  };
};

export const AdminLayout: React.FunctionComponent<Props> = props => {
  useAdminOrders();

  return <Layout {...props} />;
};
