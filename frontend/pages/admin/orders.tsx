import { Component } from 'react';
import io from 'socket.io-client';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';
import OrderContainer from '../../components/OrderContainer';
import { BACKEND_URL } from '../../config';
import { Order } from '../../interfaces/Order';

interface State {
  orders: Order[];
}
class Orders extends Component<any, State> {
  state = {
    orders: []
  };

  socket: SocketIOClient.Socket;

  componentDidMount() {
    this.socket = io(`${BACKEND_URL}`);
    /**
     * Listen for events
     */
    this.socket.on('placed_order', this.setOrders);
    this.socket.on('fetched_orders', this.setOrders);
  }

  componentWillUnmount() {
    this.socket.off('placed_order');
    this.socket.off('fetched_order');
  }

  setOrders = (orders: Order[]) => {
    this.setState({ orders });
  };

  render() {
    const { orders } = this.state;
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="orders">
          <OrderContainer orders={orders} />
        </AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default withAuth(Orders);
