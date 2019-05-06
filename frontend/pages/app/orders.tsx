import { Empty } from 'antd';
import Head from 'next/head';
import React, { useContext } from 'react';
import FlexContainer from '../../components/FlexContainer';
import Order from '../../components/OrderCard';
import PageHeader from '../../components/PageHeader';
import { CustomerContext } from '../../context';

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
        <title>Orders • LuncherBox</title>
      </Head>
      <FlexContainer>
        <PageHeader
          title={
            <h1>
              <strong>My orders</strong>
            </h1>
          }
          subTitle={
            <h3>
              <strong>({orderHistory.length})</strong>
            </h3>
          }
        >
          {data}
        </PageHeader>
      </FlexContainer>
    </>
  );
};
