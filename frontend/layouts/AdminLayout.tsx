import { notification } from 'antd';
import Router from 'next/router';
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
      socketContext.socket.on('placed-order-admin', handlePlacedOrder);
      socketContext.socket.on('accepted-order-admin', setAcceptedOrder);
      socketContext.socket.on('declined-order-admin', setDeclindedOrder);
      socketContext.socket.on('finished-order-admin', setFinishedOrder);
    }
    return () => {
      if (socketContext.socket) {
        socketContext.socket.off('placed-order-admin', handlePlacedOrder);
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

  const handlePlacedOrder = (order: Order) => {
    adminContext.dispatch({ type: 'pushOrder', payload: order });
    showNotifOnPlacedOrder(order);
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

  const showNotifOnPlacedOrder = (order: Order) => {
    const ProductList = (
      <div>
        {order.products.map(({ product, quantity }) => {
          return (
            <div
              key={product.id}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <p>
                {quantity} x {product.name}
              </p>
            </div>
          );
        })}
      </div>
    );

    notification.info({
      message: (
        <h2
          style={{
            color: '#000000a6',
            margin: 0,
            marginBottom: 12,
            fontSize: '1.2rem',
            fontWeight: 525
          }}
        >
          New order has been placed on table {order.table.name}
        </h2>
      ),
      onClick() {
        Router.replace('/admin/orders');
      },
      description: (
        <>
          {ProductList}
          <strong>Click here to go to the orders page now!</strong>
        </>
      )
    });
  };
};

export const AdminLayout: React.FunctionComponent<Props> = props => {
  useAdminOrders();

  return <Layout {...props} />;
};
