import { Empty } from 'antd';
import { useContext, useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import OrderContainer from '../../components/OrderContainer';
import Spinner from '../../components/Spinner';
import withAuth from '../../components/withAuth';
import { AdminContext } from '../../context';
import { Order } from '../../interfaces';

const useOrders = (initialOrders: Order[]): [Order[], boolean] => {
  const [orders, setOrders] = useState(initialOrders);
  const [loading, setLoading] = useState(true);
  const context = useContext(AdminContext);

  useEffect(() => {
    if (context.socket) {
      context.socket.on('fetched_orders', handleOrders);
      context.socket.on('placed_order', handleOrders);
      context.socket.on('accepted_order_admin', setAcceptedOrder);
      context.socket.on('declined_order_admin', setDeclindedOrder);
      context.socket.on('finished_order_admin', setFinishedOrder);
    }

    return () => {
      if (context.socket) {
        context.socket.off('fetched_orders', handleOrders);
        context.socket.off('placed_order', handleOrders);
        context.socket.off('accepted_order_admin', setAcceptedOrder);
        context.socket.off('declined_order_admin', setDeclindedOrder);
        context.socket.off('finished_order_admin', setFinishedOrder);
      }
    };
  }, [orders]);

  useEffect(() => {
    if (context.socket) {
      context.socket.emit('fetch_orders');
    }
  }, []);

  const setAcceptedOrder = ({ id }: any) => {
    const orderIndex = orders.findIndex((order: Order) => order.id === id);

    if (orderIndex >= 0) {
      const editedOrders = [...orders];
      // @ts-ignore
      const acceptedOrder: Order = { ...editedOrders[orderIndex] };
      acceptedOrder.state = 1;
      // @ts-ignore
      editedOrders[orderIndex] = acceptedOrder;
      setOrders(editedOrders);
    }
  };

  const setDeclindedOrder = ({ id }: any) => {
    const orderIndex = orders.findIndex((order: Order) => order.id === id);

    if (orderIndex >= 0) {
      const editedOrders = [...orders];
      editedOrders.splice(orderIndex, 1);
      setOrders(editedOrders);
    }
  };

  const setFinishedOrder = ({ id }: any) => {
    const orderIndex = orders.findIndex((order: Order) => order.id === id);

    if (orderIndex >= 0) {
      const editedOrders = [...orders];
      // @ts-ignore
      const acceptedOrder: Order = { ...editedOrders[orderIndex] };
      acceptedOrder.state = 2;
      // @ts-ignore
      editedOrders[orderIndex] = acceptedOrder;
      setOrders(editedOrders);
    }
  };

  const handleOrders = (incomingOrders: Order[]) => {
    setOrders(incomingOrders);
    setLoading(false);
  };

  return [orders, loading];
};

const Orders: React.FunctionComponent<any> = () => {
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

  return (
    <FullHeightContainer>
      <AdminLayout selectedKey="orders">{data}</AdminLayout>
    </FullHeightContainer>
  );
};

export default withAuth(Orders);
