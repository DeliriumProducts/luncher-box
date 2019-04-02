import { Empty, Input } from 'antd';
import Head from 'next/head';
import React, { useContext } from 'react';
import styled from 'styled-components';
import Order from '../../components/OrderCard';
import { CustomerContext } from '../../context';

const { TextArea } = Input;

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex-direction: column;
  padding: 2rem;
  background-color: #fafafa;
  border-radius: 7px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);

  @media (min-width: 768px) {
    margin: auto;
    width: 70%;
  }

  @media (max-width: 480px) {
    border-radius: 0;
  }
`;

interface State {
  modalVisible: boolean;
  loadingFromLocal: boolean;
}

export default () => {
  const { orderHistory } = useContext(CustomerContext);
  let data: React.ReactNode[] | React.ReactNode;

  if (orderHistory.length) {
    data = orderHistory.map(order => {
      return <Order order={order} key={`${order.id}`} />;
    });
  } else {
    data = (
      <Empty description="No orders">
        No orders placed yet. Go and place some!
      </Empty>
    );
  }

  return (
    <>
      <Head>
        <title>
          {orderHistory.length > 0
            ? `(${orderHistory.length}) ${
                orderHistory.length === 1 ? 'Order' : 'Orders'
              }`
            : 'Orders'}{' '}
          • LuncherBox
        </title>
      </Head>
      <FlexContainer>{data}</FlexContainer>
    </>
  );
};
