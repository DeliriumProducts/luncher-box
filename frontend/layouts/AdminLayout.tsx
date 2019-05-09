import { Button, Modal, notification } from 'antd';
import Router from 'next/router';
import React, { ReactNode } from 'react';
import { OrderAPI } from '../api';
import { AdminContext, SocketContext } from '../context';
import { Order } from '../interfaces';
import { Role } from '../types';
import Layout from './_layout';

interface Props {
  route: string;
  type: 'admin' | 'customer';
  children?: ReactNode;
}

const useAdminOrders = () => {
  const adminContext = React.useContext(AdminContext);
  const socketContext = React.useContext(SocketContext);
  const role = React.useRef<Role>(adminContext.state.user.role!);

  /**
   * We need access to the "freshest" role value
   */
  React.useEffect(() => {
    role.current = adminContext.state.user.role!;
  }, [adminContext.state.user.role]);

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
    showNotifOnOrderUpdate(order);
  };

  const setAcceptedOrder = (order: Order) => {
    adminContext.dispatch({
      type: 'setOrderState',
      payload: { id: order.id, orderState: 1 }
    });
    showNotifOnOrderUpdate(order);
  };

  const setFinishedOrder = (order: Order) => {
    adminContext.dispatch({
      type: 'setOrderState',
      payload: { id: order.id, orderState: 2 }
    });
    showNotifOnOrderUpdate(order);
  };

  const setDeclindedOrder = ({ id }) => {
    adminContext.dispatch({
      type: 'setOrderState',
      payload: { id, orderState: 3 }
    });
  };

  const showNotifOnOrderUpdate = (order: Order) => {
    let data: React.ReactNode | React.ReactNode[];
    let modalType: 'info' | 'error' | 'success' | 'warning' = 'info';

    if (order.state === 0) {
      data = (
        <>
          An order on table <strong>{order.table.name}</strong> has been placed!
          🍽
        </>
      );

      modalType = 'info';
    } else if (order.state === 1) {
      data = (
        <>
          An order on table <strong>{order.table.name}</strong> has been
          accepted! 🎉
        </>
      );

      modalType = 'success';
    } else if (order.state === 2) {
      data = (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>
              An order on table <strong>{order.table.name}</strong> has been
              finished! 🍚
            </p>
          </div>
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
        </>
      );

      modalType = 'success';
    }

    if (role.current === 'Waiter') {
      if (order.state === 2) {
        Modal[modalType]({
          title: 'New order status!',
          content: data
        });
      } else if (order.state === 0) {
        notification[modalType]({
          message: 'New order status!',
          key: order.id,
          btn: (
            <Button
              type="primary"
              onClick={() => {
                Router.replace('/admin/tables');
                notification.close(order.id!);
              }}
            >
              Go check it!
            </Button>
          ),
          description: <>{data}</>
        });
      }
    } else if (role.current === 'Cook') {
      if (order.state === 1) {
        notification[modalType]({
          message: data
        });
      }
    }
  };
};

export const AdminLayout: React.FunctionComponent<Props> = props => {
  useAdminOrders();

  return <Layout {...props} />;
};
