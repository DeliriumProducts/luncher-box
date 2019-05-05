import { Empty } from 'antd';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { OrderAPI } from '../../api';
import OrderContainer from '../../components/OrderContainer';
import Spinner from '../../components/Spinner';
import withAuth from '../../components/withAuth';
import { SocketContext } from '../../context';
import { Order } from '../../interfaces';

const FlexContainer = styled.div`
  background-color: #fafafa;
  padding: 2rem;
  border-radius: 7px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);

  @media (max-width: 480px) {
    border-radius: 0;
  }
`;

const useOrders = (initialOrders: Order[]): [Order[], boolean] => {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);
  const context = useContext(SocketContext);

  useEffect(() => {
    if (context.socket) {
      context.socket.on('placed-order-admin', handleIncomingOrders);
      context.socket.on('accepted-order-admin', setAcceptedOrder);
      context.socket.on('declined-order-admin', setDeclindedOrder);
      context.socket.on('finished-order-admin', setFinishedOrder);
    }

    return () => {
      if (context.socket) {
        context.socket.off('placed-order-admin', handleIncomingOrders);
        context.socket.off('accepted-order-admin', setAcceptedOrder);
        context.socket.off('declined-order-admin', setDeclindedOrder);
        context.socket.off('finished-order-admin', setFinishedOrder);
      }
    };
  }, [context.socket]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const setAcceptedOrder = ({ id }: any) => {
    setOrders(prevOrders =>
      prevOrders.map(
        (order): Order => {
          if (order.id === id) {
            return {
              ...order,
              state: 1
            };
          }

          return order;
        }
      )
    );
  };

  const setDeclindedOrder = ({ id }: any) => {
    setOrders(prevOrders =>
      prevOrders.map(
        (order): Order => {
          if (order.id === id) {
            return {
              ...order,
              state: 3
            };
          }

          return order;
        }
      )
    );
  };

  const setFinishedOrder = ({ id }: any) => {
    setOrders(prevOrders =>
      prevOrders.map(
        (order): Order => {
          if (order.id === id) {
            return {
              ...order,
              state: 2
            };
          }

          return order;
        }
      )
    );
  };

  const fetchOrders = async () => {
    const incomingOrders = await OrderAPI.getAll();
    setOrders(incomingOrders);
    setLoading(false);
  };

  const handleIncomingOrders = (incomingOrders: Order[]) => {
    setOrders(incomingOrders);
    setLoading(false);
  };

  return [orders, loading];
};

const Orders: React.FunctionComponent = () => {
  const [orders, loading] = useOrders([]);

  let data: React.ReactNode | React.ReactNode[];
  if (loading) {
    data = <Spinner />;
  } else {
    if (orders.length) {
      data = <OrderContainer orders={orders} />;
    } else {
      data = <Empty description="No orders placed yet!" />;
    }
  }

  const newOrders = orders.reduce(
    (total, current) => total + (current.state === 0 ? 1 : 0),
    0
  );

  return (
    <>
      <Head>
        <title>
          {newOrders > 0
            ? `(${newOrders}) New ${newOrders === 1 ? 'Order' : 'Orders'}`
            : 'Orders'}{' '}
          • LuncherBox
        </title>
      </Head>
      <FlexContainer>{data}</FlexContainer>
    </>
  );
};

export default withAuth(Orders);
