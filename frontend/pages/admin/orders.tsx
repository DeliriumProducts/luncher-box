import { Empty } from 'antd';
import Head from 'next/head';
import React from 'react';
import FlexContainer from '../../components/FlexContainer';
import OrderCardContainer from '../../components/OrderCardContainer';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import { AdminContext } from '../../context';
import { withAuth } from '../../hocs';

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
        <PageHeader
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
        </PageHeader>
      </FlexContainer>
    </>
  );
};

export default withAuth(Orders);
