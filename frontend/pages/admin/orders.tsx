import { Empty, PageHeader } from 'antd';
import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import FlexContainer from '../../components/FlexContainer';
import OrderCardContainer from '../../components/OrderCardContainer';
import Spinner from '../../components/Spinner';
import { AdminContext } from '../../context';
import { withAuth } from '../../hocs';

const StyledPageHeader = styled(PageHeader)`
  background-color: #fafafa;
  border-radius: 7px;
  flex: 1;

  @media (max-width: 480px) {
    border-radius: 0;
    margin: 0;
  }
`;

const Orders: React.FunctionComponent = () => {
  const { state } = React.useContext(AdminContext);

  let data: React.ReactNode | React.ReactNode[];
  if (state.loading) {
    data = <Spinner />;
  } else {
    if (state.orders.length) {
      data = <OrderCardContainer orders={state.orders} />;
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
      <FlexContainer>
        <StyledPageHeader
          title={
            <h1>
              <strong>Orders</strong>
            </h1>
          }
          subTitle={
            <h3>
              <strong>({state.orders.length})</strong>
            </h3>
          }
        >
          {data}
        </StyledPageHeader>
      </FlexContainer>
    </>
  );
};

export default withAuth(Orders);
