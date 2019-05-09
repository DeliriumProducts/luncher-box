import { message, notification } from 'antd';
import React, { ReactNode } from 'react';
import { CustomerContext, SocketContext } from '../context';
import { Order } from '../interfaces';
import Layout from './_layout';

interface Props {
  route: string;
  type: 'admin' | 'customer';
  children?: ReactNode;
}

const useCustomerOrders = () => {
  const customerContext = React.useContext(CustomerContext);
  const orderHistory = React.useRef(customerContext.orderHistory);
  const socketContext = React.useContext(SocketContext);

  /**
   * Send the newest customerId to the backend to update the orders
   */
  React.useEffect(() => {
    if (customerContext.hasFinishedSyncing) {
      const orderIds = customerContext.orderHistory.reduce(
        (acc: string[], order) => [...acc, order.id!],
        []
      );

      if (socketContext.socket) {
        socketContext.socket.emit('update-customerId', orderIds);
      }

      orderHistory.current = customerContext.orderHistory;
    }
  }, [customerContext.hasFinishedSyncing]);

  /**
   * Subscribe to different socket messages
   */
  React.useEffect(() => {
    if (socketContext.socket) {
      socketContext.socket.on('placed-order', handlePlacedOrder);
      socketContext.socket.on('accepted-order', handleNewOrderState);
      socketContext.socket.on('declined-order', handleNewOrderState);
      socketContext.socket.on('finished-order', handleNewOrderState);
      socketContext.socket.on('updated-customerId', handleUpdatedCustomerId);
    }

    return () => {
      if (socketContext.socket) {
        socketContext.socket.off('placed-order');
        socketContext.socket.off('accepted-order');
        socketContext.socket.off('declined-order');
        socketContext.socket.off('finished-order');
        socketContext.socket.off('updated-customerId');
      }
    };
  }, [socketContext.socket]);

  const showNotifOnStateChange = (order: Order) => {
    let data: React.ReactNode | React.ReactNode[];
    let modalType: 'info' | 'error' | 'success' | 'warning';

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

    if (order.state === 0) {
      data = (
        <>
          {ProductList}
          <strong>Your order has been placed! 🍽</strong>
        </>
      );

      modalType = 'info';
    } else if (order.state === 1) {
      data = (
        <>
          {ProductList}
          <strong>Your order has been accepted! 🎉</strong>
        </>
      );

      modalType = 'success';
    } else if (order.state === 2) {
      data = (
        <>
          {ProductList}
          <strong>Your order is on the way! 🍚</strong>
        </>
      );

      modalType = 'success';
    } else {
      data = (
        <>
          {ProductList}
          <strong>Your order has been declined! ❌</strong>
        </>
      );

      modalType = 'error';
    }

    notification[modalType]({
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
          Order state:{' '}
        </h2>
      ),
      description: data
    });
  };

  const handleNewOrderState = (order: Order) => {
    showNotifOnStateChange(order);
    customerContext.actions.updateOrderHistory(order);
  };

  const handlePlacedOrder = (order: Order) => {
    if (order.state === 0) {
      showNotifOnStateChange(order);

      customerContext.actions.pushOrderHistory(order);
    } else {
      message.error('Some error occurred! Your order has not been placed! ❌');
    }
  };

  const handleUpdatedCustomerId = (orders: Order[]) => {
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].state !== orderHistory.current[i].state) {
        const order = orders[i];
        showNotifOnStateChange(order);
      }
    }

    customerContext.actions.overwriteOrderHistory(orders);
  };
};

export const CustomerLayout: React.FunctionComponent<Props> = props => {
  useCustomerOrders();

  return <Layout {...props} />;
};
