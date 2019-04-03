import { Affix, Layout as AntDesignLayout, message, Modal } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { CustomerContext, SocketContext } from '../context';
import { Order, Product } from '../interfaces';
import MenuBar from './MenuBar';

const { Content } = AntDesignLayout;

interface Props {
  route: string;
  type: 'admin' | 'customer';
  children?: ReactNode;
}

const StyledLayout = styled(AntDesignLayout)`
  min-height: 100%;
  background: rgba(0, 0, 0, 0);
`;

const StyledContent = styled(Content)`
  padding: 50px;
  margin-bottom: 47px;
  height: auto;

  @media (max-width: 480px) {
    padding: 0;
  }
`;

const Layout: React.FunctionComponent<Props> = props => {
  const { route, type } = props;

  if (route === '/login' || route === '/register' || route === '/') {
    return <>{props.children}</>;
  }

  const socketContext = React.useContext(SocketContext);
  const customerContext = React.useContext(CustomerContext);

  const handleNewOrderState = (order: Order) => {
    let data: React.ReactNode | React.ReactNode[];

    const ProductList = (
      <div>
        {order.products.map((product: Product) => {
          return (
            <div
              key={product.id}
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              <p>
                {product.quantity} x {product.name}
              </p>
            </div>
          );
        })}
      </div>
    );

    if (order.state === 1) {
      data = (
        <>
          {ProductList}
          <strong>You order has been accepted! 🎉</strong>
        </>
      );
    } else if (order.state === 2) {
      data = (
        <>
          {ProductList}
          <strong>Your order is on the way! 🍚</strong>
        </>
      );
    } else {
      data = (
        <>
          {ProductList}
          <strong>Your order has been declined! ❌</strong>
        </>
      );
    }

    Modal.info({
      title: (
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
      centered: true,
      content: data,
      // tslint:disable-next-line
      onOk: () => {},
      maskClosable: true
    });

    customerContext.actions.updateOrderHistory(order);
  };

  const handlePlacedOrder = (order: Order) => {
    if (order.state === 0) {
      message.success('You order has been placed! 🍽');

      customerContext.actions.updateOrderHistory(order);
    } else {
      message.error('Some error occurred! Your order has not been placed! ❌');
    }
  };

  React.useEffect(() => {
    if (type === 'customer') {
      if (customerContext.hasFinishedSyncing) {
        const orderIds = customerContext.orderHistory.reduce(
          (acc: string[], order) => [...acc, order.id!],
          []
        );

        if (socketContext.socket) {
          socketContext.socket.emit('update_customer_id', orderIds);
        }
      }
    }
  }, [customerContext.hasFinishedSyncing]);

  /**
   * Subscribe to different socket messages
   */
  React.useEffect(() => {
    if (type === 'customer') {
      if (socketContext.socket) {
        socketContext.socket.on('placed_order', handlePlacedOrder);
        socketContext.socket.on('accepted_order', handleNewOrderState);
        socketContext.socket.on('declined_order', handleNewOrderState);
        socketContext.socket.on('finished_order', handleNewOrderState);
      }

      return () => {
        if (socketContext.socket) {
          socketContext.socket.off('placed_order');
          socketContext.socket.off('accepted_order');
          socketContext.socket.off('declined_order');
          socketContext.socket.off('finished_order');
        }
      };
    } else {
      return () => {};
    }
  }, [socketContext.socket]);

  return (
    <StyledLayout>
      <Affix offsetTop={0}>
        <MenuBar type={type} selectedKey={props.route} />
      </Affix>
      <StyledContent>{props.children}</StyledContent>
    </StyledLayout>
  );
};

export default Layout;
