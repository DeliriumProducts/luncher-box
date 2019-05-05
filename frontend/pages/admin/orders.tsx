import { Empty } from 'antd';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import OrderContainer from '../../components/OrderContainer';
import Spinner from '../../components/Spinner';
import { AdminContext } from '../../context';
import { withAuth } from '../../hocs';

const FlexContainer = styled.div`
  background-color: #fafafa;
  padding: 2rem;
  border-radius: 7px;
  box-shadow: 0 20px 24px -18px rgba(0, 0, 0, 0.31);

  @media (max-width: 480px) {
    border-radius: 0;
  }
`;

const Orders: React.FunctionComponent = () => {
  const { state } = React.useContext(AdminContext);

  let data: React.ReactNode | React.ReactNode[];
  if (state.loading) {
    data = <Spinner />;
  } else {
    if (state.orders.length) {
      data = <OrderContainer orders={state.orders} />;
    } else {
      data = <Empty description="No orders placed yet!" />;
    }
  }

  const newOrders = state.orders.reduce(
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
