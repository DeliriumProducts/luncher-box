import {
  ConnectedSocket,
  MessageBody,
  OnConnect,
  OnMessage,
  SocketController,
  SocketIO,
  EmitOnSuccess
} from 'socket-controllers';
import { redisClient } from '../config';

@SocketController()
export class OrderController {
  @OnConnect()
  @EmitOnSuccess('orders_fetched')
  async connection(@SocketIO() io: any) {
    /**
     * Return all orders to the client on connect
     */
    const key = 'orders';
    const value = await redisClient.get(key);
    console.log('VALUE E : ', value);
    const orders = [];
    if (value) {
      for (const order of value) {
        /**
         * Trqbva da parse-na vseki element ot array-a i suotvetno da pushna vseki edin order
         */
        const parsedOrder = JSON.parse(order);
      }
      orders.push(JSON.parse(value));
      return [orders];
    } else {
      return [];
    }
  }

  @OnMessage('place_order')
  @EmitOnSuccess('order_placed')
  async place(@MessageBody() data: any) {
    /**
     * Attach state to order (isAccepted)
     */
    console.log(data);
    const { isAccepted } = data;
    let { order } = data;
    order = { order, isAccepted };

    const key = 'orders';
    const value = await redisClient.get(key);
    const orders: any = [];

    if (value) {
      orders.push(JSON.parse(value), order);
    } else {
      orders.push({ order });
    }

    redisClient.set(key, orders);
    return { orders };
  }
}
