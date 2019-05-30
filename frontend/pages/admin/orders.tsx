import { Empty, message, Popconfirm } from 'antd';
import Head from 'next/head';
import React from 'react';
import { OrderAPI } from '../../api';
import ActionButton from '../../components/ActionButton';
import FlexContainer from '../../components/FlexContainer';
import OrderCardContainer from '../../components/OrderCardContainer';
import PageHeader from '../../components/PageHeader';
import Spinner from '../../components/Spinner';
import { AdminContext } from '../../context';
import { withAuth } from '../../hocs';

const Orders: React.FunctionComponent = () => {
  const { state, dispatch } = React.useContext(AdminContext);

  let data: React.ReactNode | React.ReactNode[];

  const filteredOrders = React.useMemo(
    () =>
      state.orders.filter(o => {
        /**
         * Admins should see the all orders and cooks - only the accepted ones
         */
        if (state.user.role === 'Admin') {
          return true;
        } else {
          return o.state === 1;
        }
      }),
    [state.orders]
  );

  if (state.loading) {
    data = <Spinner />;
  } else {
    if (filteredOrders.length) {
      data = (
        <OrderCardContainer orders={filteredOrders} role={state.user.role} />
      );
    } else {
      data = <Empty description="No orders placed yet!" />;
    }
  }

  const handleDeleteAllClick = async () => {
    try {
      await OrderAPI.deleteAll();
      dispatch({ type: 'setOrders', payload: [] });

      message.success(`Successfully deleted all orders 🎉`);
    } catch (error) {
      message.error(`Error: ${error}`);
    }
  };

  return (
    <>
      <Head>
        <title>
          {filteredOrders.length > 0 && state.user.role === 'Cook'
            ? `(${filteredOrders}) New ${
                filteredOrders.length === 1 ? 'Order' : 'Orders'
              }`
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
              <strong>({filteredOrders.length})</strong>
            </h3>
          }
          extra={
            state.user.role === 'Admin'
              ? [
                  <Popconfirm
                    key="popconfirm-delete-all"
                    title={`Are you sure?`}
                    placement="bottom"
                    okText="Yes"
                    onConfirm={handleDeleteAllClick}
                  >
                    <ActionButton icon="delete">Delete All</ActionButton>
                  </Popconfirm>
                ]
              : []
          }
        >
          {data}
        </PageHeader>
      </FlexContainer>
    </>
  );
};

export default withAuth(Orders, ['Cook']);
