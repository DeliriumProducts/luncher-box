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
  @EmitOnSuccess('fetched_orders')
  async connection(@SocketIO() io: any) {
    const key = 'orders';
    const ordersJSON = await redisClient.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);
    }

    return orders;
  }

  @OnMessage('place_order')
  @EmitOnSuccess('placed_order')
  async place(@MessageBody() order: any) {
    /**
     * Inject state of the order
     */
    order.state = 1;

    const key = 'orders';
    const ordersJSON = await redisClient.get(key);

    let orders = [];

    if (ordersJSON) {
      orders = JSON.parse(ordersJSON);
      orders.push(order);
    } else {
      orders = [order];
    }

    /**
     * Save orders in redis server
     */
    await redisClient.set(key, JSON.stringify(orders));

    return orders;
  }
}
