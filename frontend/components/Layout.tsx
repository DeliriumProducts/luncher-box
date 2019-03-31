import { Affix, Layout as AntDesignLayout, message, Modal } from 'antd';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { CustomerContext, SocketContext } from '../context';
import { Order } from '../interfaces';
import MenuBar from './MenuBar';

const { Content } = AntDesignLayout;

interface Props {
  route: string;
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
  const socketContext = React.useContext(SocketContext);
  const customerContext = React.useContext(CustomerContext);

  if (
    props.route === '/login' ||
    props.route === '/register' ||
    props.route === '/'
  ) {
    return <>{props.children}</>;
  }

  let type: 'admin' | 'customer';
  if (props.route.startsWith('/admin')) {
    type = 'admin';
  } else {
    type = 'customer';

    const handleNewOrderState = (order: Order) => {
      let data: React.ReactNode | React.ReactNode[];

      if (order.state === 1) {
        data = <div>You order has been accepted! 🎉</div>;
      } else if (order.state === 2) {
        data = <div>Your order is on the way! 🍚</div>;
      } else {
        data = <div>Your order has been declined! ❌</div>;
      }

      Modal.info({
        title: 'Order state:',
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
        message.error(
          'Some error occurred! Your order has not been placed! ❌'
        );
      }
    };

    React.useEffect(() => {
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
    }, [socketContext.socket]);
  }

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
