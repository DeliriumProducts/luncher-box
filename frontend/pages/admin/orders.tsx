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
import { Order } from '../../interfaces';

const Orders: React.FunctionComponent = () => {
  const { state, dispatch } = React.useContext(AdminContext);
  const [orders, setOrders] = React.useState<Order[]>([]);

  React.useEffect(() => {
    /**
     * Cooks should only see the accepted orders and nothing else
     */
    if (state.user.role === 'Cook') {
      setOrders(state.orders.filter(o => o.state === 1));
    } else {
      setOrders(state.orders);
    }
  }, [state.orders]);

  let data: React.ReactNode | React.ReactNode[];
  if (state.loading) {
    data = <Spinner />;
  } else {
    if (orders.length) {
      data = <OrderCardContainer orders={orders} role={state.user.role} />;
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
      <FlexContainer>
        <PageHeader
          title={
            <h1>
              <strong>Orders</strong>
            </h1>
          }
          subTitle={
            <h3>
              <strong>({orders.length})</strong>
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
