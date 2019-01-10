import { Component } from 'react';
import io from 'socket.io-client';
import AdminLayout from '../../components/AdminLayout';
import FullHeightContainer from '../../components/FullHeightContainer';
import withAuth from '../../components/withAuth';
import OrderCard from '../../components/OrderCard';
import { BACKEND_URL } from '../../config';

class Orders extends Component {
  socket: SocketIOClient.Socket;

  componentDidMount() {
    this.socket = io(`${BACKEND_URL}`);
    /**
     * Listen for events
     */
    this.socket.on('fetched_orders', (data: any) => {
      console.log(data);
      this.socket.emit('place_order', { order: ' ei kopele' });
    });

    this.socket.on('placed_order', (data: any) => {
      console.log('this comes from placed_order', data);
    });
  }
  render() {
    return (
      <FullHeightContainer>
        <AdminLayout selectedKey="orders">
          <OrderCard orderId={4}>tuka idvat groznite</OrderCard>
        </AdminLayout>
      </FullHeightContainer>
    );
  }
}

export default withAuth(Orders);
