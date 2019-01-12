import { Component } from 'react';
import io from 'socket.io-client';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';
import OrderContainer from '../../components/OrderContainer';
import { BACKEND_URL } from '../../config';
import { Order } from '../../interfaces/Order';
import { AdminContext } from '../../context';
import Spinner from '../../components/Spinner';
import { Empty } from 'antd';

interface State {
  orders: Order[];
  loading: boolean;
}
class Orders extends Component<any, State> {
  state = {
    orders: [],
    loading: true
  };

  static contextType = AdminContext;
  context!: React.ContextType<typeof AdminContext>;

  componentDidMount() {
    /**
     * Listen for events
     */
    if (this.context.socket) {
      this.context.socket.emit('fetch_orders');
      /**
       * We will the other listeners in the callback to prevent errors.
       */
      this.context.socket.on('fetched_orders', this.setOrders);
    }
  }

  setOrders = (orders: Order[]) => {
    this.setState({ orders, loading: false }, () => {
      if (this.context.socket) {
        this.context.socket.on('placed_order', this.setOrders);
        this.context.socket.on('accepted_order', this.setAcceptedOrder);
        this.context.socket.on('declined_order', this.setDeclindedOrder);
        this.context.socket.on('finished_order', this.setFinishedOrder);
      }
    });
  };

  setAcceptedOrder = ({ orderId }: any) => {
    const orderIndex = this.state.orders.findIndex(
      (order: Order) => order.id === orderId
    );

    if (orderIndex >= 0) {
      const orders = [...this.state.orders];
      // @ts-ignore
      const acceptedOrder: Order = { ...orders[orderIndex] };
      acceptedOrder.state = 1;
      // @ts-ignore
      orders[orderIndex] = acceptedOrder;

      this.setState({ orders });
    }
  };

  setDeclindedOrder = ({ orderId }: any) => {
    const orderIndex = this.state.orders.findIndex(
      (order: Order) => order.id === orderId
    );

    if (orderIndex >= 0) {
      const orders = [...this.state.orders];
      orders.splice(orderIndex, 1);
      this.setState({ orders });
    }
  };

  setFinishedOrder = ({ orderId }: any) => {
    const orderIndex = this.state.orders.findIndex(
      (order: Order) => order.id === orderId
    );

    if (orderIndex >= 0) {
      const orders = [...this.state.orders];
      // @ts-ignore
      const acceptedOrder: Order = { ...orders[orderIndex] };
      acceptedOrder.state = 2;
      // @ts-ignore
      orders[orderIndex] = acceptedOrder;

      this.setState({ orders });
    }
  };

  componentWillUnmount() {
    if (this.context.socket) {
      /**
       * Prevent memory leak
       */
      this.context.socket.off('fetched_orders');
      this.context.socket.off('placed_order');
      this.context.socket.off('accepted_order');
      this.context.socket.off('declined_order');
      this.context.socket.off('finished_order');
    }
  }

  render() {
    const { orders, loading } = this.state;
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
  }
}

export default withAuth(Orders);
